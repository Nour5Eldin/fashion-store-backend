import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { reviewService } from "../services/review.service";
import { getParam } from "../utils/request.utils";

export class ReviewController {
    getProductReviews = asyncHandler(async (req: Request, res: Response) => {
        const result = await reviewService.getProductReviews(
            getParam(req.params.productId),
            {
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 10,
                stars: req.query.stars ? Number(req.query.stars) : undefined,
            }
        );
        res.status(200).json(ApiResponse.ok(result));
    });
    createReview = asyncHandler(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];

        const review = await reviewService.createReview({
            productId: getParam(req.params.productId),
            userId: req.user!.userId,
            stars: Number(req.body.stars),
            comment: req.body.comment,
            imagePaths: files?.map(f => f.path) || [],
        });

        res.status(201).json(
            ApiResponse.created(review, "Review submitted successfully.")
        );
    });
    updateReview = asyncHandler(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];

        const review = await reviewService.updateReview(
            getParam(req.params.id),
            req.user!.userId,
            {
                stars: req.body.stars ? Number(req.body.stars) : undefined,
                comment: req.body.comment,
                imagePaths: files?.map(f => f.path) || [],
            }
        );

        res.status(200).json(
            ApiResponse.ok(review, "Review updated successfully.")
        );
    });
    deleteReview = asyncHandler(async (req: Request, res: Response) => {
        await reviewService.deleteReview(
            getParam(req.params.id),
            req.user!.userId
        );
        res.status(200).json(
            ApiResponse.ok(null, "Review deleted successfully.")
        );
    });
    getAdminReviews = asyncHandler(async (req: Request, res: Response) => {
        const result = await reviewService.getAdminReviews({
            productId: req.query.productId as string,
            isApproved: req.query.isApproved !== undefined
                ? req.query.isApproved === "true" : undefined,
            stars: req.query.stars ? Number(req.query.stars) : undefined,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
        });
        res.status(200).json(ApiResponse.ok(result));
    });

    toggleApproval = asyncHandler(async (req: Request, res: Response) => {
        const review = await reviewService.toggleApproval(
            getParam(req.params.id),
            req.body.isApproved
        );
        res.status(200).json(
            ApiResponse.ok(review, `Review ${req.body.isApproved ? "approved" : "hidden"}.`)
        );
    });
}

export const reviewController = new ReviewController();