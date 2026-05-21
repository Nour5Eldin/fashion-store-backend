import mongoose from "mongoose";
import { Review, IReview } from "../models/review.model";
import { BaseRepository } from "./base.repository";

export class ReviewRepository extends BaseRepository<IReview> {
    constructor() {
        super(Review);
    }
    async getProductReviews(
        productId: string,
        options: {
            page?: number;
            limit?: number;
            stars?: number;
        } = {}
    ) {
        const filter: Record<string, unknown> = {
            productId,
            isApproved: true,
        };

        if (options.stars) filter["stars"] = options.stars;

        return this.paginate(filter, {
            page: options.page || 1,
            limit: options.limit || 10,
            sort: { createdAt: -1 },
            populate: "userId",
        });
    }
    async getRatingSummary(productId: string): Promise<{
        average: number;
        total: number;
        breakdown: Record<number, number>;
    }> {
        const result = await Review.aggregate([
            {
                $match: {
                    productId: new mongoose.Types.ObjectId(productId),
                    isApproved: true,
                },
            },
            {
                $group: {
                    _id: "$stars",
                    count: { $sum: 1 },
                },
            },
        ]);

        const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let total = 0;
        let sumStars = 0;

        result.forEach(r => {
            breakdown[r._id] = r.count;
            total += r.count;
            sumStars += r._id * r.count;
        });

        return {
            average: total > 0 ? Math.round((sumStars / total) * 10) / 10 : 0,
            total,
            breakdown,
        };
    }
    async hasUserReviewed(
        userId: string,
        productId: string
    ): Promise<boolean> {
        return this.exists({ userId, productId });
    }
    async checkVerifiedPurchase(
        userId: string,
        productId: string
    ): Promise<boolean> {
        const { Order } = await import("../models/order.model");
        const { OrderStatus } = await import("../types/enum");
        const order = await Order.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            status:     { $in: [OrderStatus.RECEIVED, OrderStatus.SHIPPED] },
            "products.productId": new mongoose.Types.ObjectId(productId),
        });
        return !!order;
    }
    async getUserReview(
        userId: string,
        productId: string
    ): Promise<IReview | null> {
        return this.findOne({ userId, productId });
    }
    async getAdminReviews(options: {
        productId?: string;
        isApproved?: boolean;
        stars?: number;
        page?: number;
        limit?: number;
    } = {}) {
        const filter: Record<string, unknown> = {};

        if (options.productId) filter["productId"] = options.productId;
        if (options.isApproved !== undefined) filter["isApproved"] = options.isApproved;
        if (options.stars) filter["stars"] = options.stars;

        return this.paginate(filter, {
            page: options.page || 1,
            limit: options.limit || 20,
            sort: { createdAt: -1 },
            populate: ["userId", "productId"],
        });
    }
}

export const reviewRepository = new ReviewRepository();