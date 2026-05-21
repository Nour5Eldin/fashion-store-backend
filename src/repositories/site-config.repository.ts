import { SiteConfig, ISiteConfig } from "../models/site-config.model";
import { BaseRepository } from "./base.repository";

export class SiteConfigRepository extends BaseRepository<ISiteConfig> {
    constructor() {
        super(SiteConfig);
    }

    async getOrInitialize(): Promise<ISiteConfig> {
        let config = await this.findOne({});
        if (!config) {
            config = await this.create({
                campaignTag: "LIMITED EDITION",
                campaignTitle: "Summer Collection 2026",
                campaignDescription: "Discover the essence of summer with our meticulously curated pieces, crafted for sun-drenched days and warm evenings.",
                campaignBtnText: "EXPLORE CAMPAIGN",
                campaignBtnLink: "/products",
            });
        }
        return config;
    }

    async updateCampaign(data: Partial<ISiteConfig>): Promise<ISiteConfig | null> {
        const config = await this.getOrInitialize();
        return this.updateById(config._id.toString(), data as any);
    }
}

export const siteConfigRepository = new SiteConfigRepository();
