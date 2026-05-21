import mongoose, { Document, Schema } from "mongoose";

export interface ISiteConfig extends Document {
    campaignTag: string;
    campaignTitle: string;
    campaignDescription: string;
    campaignBtnText: string;
    campaignBtnLink: string;
    createdAt: Date;
    updatedAt: Date;
}

const siteConfigSchema = new Schema<ISiteConfig>(
    {
        campaignTag: {
            type: String,
            default: "LIMITED EDITION",
            trim: true,
        },
        campaignTitle: {
            type: String,
            default: "Summer Collection 2026",
            trim: true,
        },
        campaignDescription: {
            type: String,
            default: "Discover the essence of summer with our meticulously curated pieces, crafted for sun-drenched days and warm evenings.",
            trim: true,
        },
        campaignBtnText: {
            type: String,
            default: "EXPLORE CAMPAIGN",
            trim: true,
        },
        campaignBtnLink: {
            type: String,
            default: "/products",
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret: Record<string, unknown>) => {
                ret["__v"] = undefined;
                return ret;
            },
        },
    }
);

export const SiteConfig = mongoose.model<ISiteConfig>("SiteConfig", siteConfigSchema);
