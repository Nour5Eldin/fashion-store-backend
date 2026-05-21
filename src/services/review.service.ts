import { cloudinary } from "../config/cloudinary";
import { ApiError } from "../utils/ApiError";
import { reviewRepository } from "../repositories/review.repository";
import { productRepository } from "../repositories/product.repository";
import { IReview } from "../models/review.model";

export interface CreateReviewDTO {
    productId: string;
    userId: string;
    stars: number;
    comment: string;
    imagePaths?: string[];
}

export interface UpdateReviewDTO {
    stars?: number;
    comment?: string;
    imagePaths?: string[];
}

export class ReviewService {

    async createReview(dto: CreateReviewDTO): Promise<IReview> {

        const product = await productRepository.findById(dto.productId);
        if (!product || product.isDeleted) {
            throw ApiError.notFound("Product not found.");
        }
        const alreadyReviewed = await reviewRepository.hasUserReviewed(
            dto.userId,
            dto.productId
        );
        if (alreadyReviewed) {
            throw ApiError.badRequest(
                "You have already reviewed this product."
            );
        }
        const isVerified = await reviewRepository.checkVerifiedPurchase(
            dto.userId,
            dto.productId
        );
        let imageUrls: string[] = [];
        if (dto.imagePaths && dto.imagePaths.length > 0) {
            if (dto.imagePaths.length > 3) {
                throw ApiError.badRequest("Maximum 3 images per review.");
            }

            const uploadResults = await Promise.all(
                dto.imagePaths.map(path =>
                    cloudinary.uploader.upload(path, {
                        folder: "fashion-store/reviews",
                        transformation: [
                            { quality: "auto", fetch_format: "auto" },
                            { width: 800, crop: "limit" },
                        ],
                    })
                )
            );

            imageUrls = uploadResults.map(r => r.secure_url);
        }
        return reviewRepository.create({
            productId: dto.productId as unknown as IReview["productId"],
            userId: dto.userId as unknown as IReview["userId"],
            stars: dto.stars,
            comment: dto.comment,
            images: imageUrls,
            isVerified,
            isApproved: true,
        });
    }
    async getProductReviews(
        productId: string,
        options: { page?: number; limit?: number; stars?: number }
    ) {
        const [reviews, summary] = await Promise.all([
            reviewRepository.getProductReviews(productId, options),
            reviewRepository.getRatingSummary(productId),
        ]);

        return { reviews, summary };
    }
    async updateReview(
        reviewId: string,
        userId: string,
        dto: UpdateReviewDTO
    ): Promise<IReview> {

        const review = await reviewRepository.findOne({
            _id: reviewId,
            userId,
        });
        if (!review) throw ApiError.notFound("Review not found.");
        let imageUrls: string[] | undefined;
        if (dto.imagePaths && dto.imagePaths.length > 0) {
            if (dto.imagePaths.length > 3) {
                throw ApiError.badRequest("Maximum 3 images per review.");
            }
            if (review.images.length > 0) {
                await Promise.all(
                    review.images.map(url => {
                        const parts = url.split("/");
                        const fileName = parts[parts.length - 1];
                        const publicId = `fashion-store/reviews/${fileName.split(".")[0]}`;
                        return cloudinary.uploader.destroy(publicId);
                    })
                );
            }

            const uploadResults = await Promise.all(
                dto.imagePaths.map(path =>
                    cloudinary.uploader.upload(path, {
                        folder: "fashion-store/reviews",
                        transformation: [
                            { quality: "auto", fetch_format: "auto" },
                            { width: 800, crop: "limit" },
                        ],
                    })
                )
            );

            imageUrls = uploadResults.map(r => r.secure_url);
        }
        if (dto.stars) review.set("stars", dto.stars);
        if (dto.comment) review.set("comment", dto.comment);
        if (imageUrls) review.set("images", imageUrls);

        return review.save();
    }
    async deleteReview(reviewId: string, userId: string): Promise<void> {
        const review = await reviewRepository.findOne({ _id: reviewId, userId });
        if (!review) throw ApiError.notFound("Review not found.");
        if (review.images.length > 0) {
            await Promise.all(
                review.images.map(url => {
                    const parts = url.split("/");
                    const fileName = parts[parts.length - 1];
                    const publicId = `fashion-store/reviews/${fileName.split(".")[0]}`;
                    return cloudinary.uploader.destroy(publicId);
                })
            );
        }

        await reviewRepository.deleteById(reviewId);
    }
    async toggleApproval(
        reviewId: string,
        isApproved: boolean
    ): Promise<IReview> {
        const review = await reviewRepository.updateById(
            reviewId,
            { isApproved }
        );
        if (!review) throw ApiError.notFound("Review not found.");
        return review;
    }
    async getAdminReviews(options: {
        productId?: string;
        isApproved?: boolean;
        stars?: number;
        page?: number;
        limit?: number;
    }) {
        return reviewRepository.getAdminReviews(options);
    }
}

export const reviewService = new ReviewService();