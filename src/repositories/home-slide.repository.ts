import { HomeSlide, IHomeSlide } from "../models/home-slide.model";
import { BaseRepository } from "./base.repository";

export class HomeSlideRepository extends BaseRepository<IHomeSlide> {
    constructor() {
        super(HomeSlide);
    }

    async getActiveSlides(): Promise<IHomeSlide[]> {
        return this.findMany(
            { isActive: true },
            { sort: { order: 1, createdAt: -1 } }
        );
    }
}

export const homeSlideRepository = new HomeSlideRepository();
