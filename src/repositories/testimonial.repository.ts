import { Testimonial, ITestimonial } from "../models/testimonial.model";
import { BaseRepository } from "./base.repository";
import { TestimonialStatus } from "../types/enum";

export class TestimonialRepository extends BaseRepository<ITestimonial> {
    constructor() {
        super(Testimonial);
    }

    async getApproved(limit = 10): Promise<ITestimonial[]> {
        return this.findMany(
            { status: TestimonialStatus.APPROVED },
            {
                sort: { createdAt: -1 },
                limit,
                populate: "userId",
            }
        );
    }
    async hasActiveTestimonial(userId: string): Promise<boolean> {
        return this.exists({
            userId,
            status: { $in: [TestimonialStatus.PENDING, TestimonialStatus.APPROVED] },
        });
    }
    async getAdminTestimonials(options: {
        stars?: number[];
        status?: TestimonialStatus;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    } = {}) {
        const filter: Record<string, unknown> = {};

        if (options.stars?.length) filter.stars = { $in: options.stars };
        if (options.status) filter.status = options.status;

        if (options.startDate || options.endDate) {
            filter.createdAt = {};
            if (options.startDate)
                (filter.createdAt as Record<string, unknown>).$gte = options.startDate;
            if (options.endDate)
                (filter.createdAt as Record<string, unknown>).$lte = options.endDate;
        }

        return this.paginate(filter, {
            page: options.page,
            limit: options.limit || 20,
            sort: { createdAt: -1 },
            populate: "userId",
        });
    }

    async updateStatus(
        testimonialId: string,
        status: TestimonialStatus
    ): Promise<ITestimonial | null> {
        return this.updateById(testimonialId, {
            status,
            isApproved: status === TestimonialStatus.APPROVED,
        });
    }
}

export const testimonialRepository = new TestimonialRepository();