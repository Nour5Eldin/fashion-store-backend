import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { testimonialRepository } from "../repositories";
import { ApiError } from "../utils/ApiError";
import { TestimonialStatus } from "../types/enum";
import { getParam } from "../utils/request.utils";

export class TestimonialController {

    getApproved = asyncHandler(async (req: Request, res: Response) => {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const result = await testimonialRepository.getApproved(limit);
        res.status(200).json(ApiResponse.ok(result));
    });
    createTestimonial = asyncHandler(async (req: Request, res: Response) => {

        const hasActive = await testimonialRepository.hasActiveTestimonial(
            req.user!.userId
        );

        if (hasActive) {
            throw ApiError.badRequest(
                "You already have a pending or approved testimonial."
            );
        }

        const testimonial = await testimonialRepository.create({
            ...req.body,
            userId: req.user!.userId,
            status: TestimonialStatus.PENDING,
        });

        res.status(201).json(
            ApiResponse.created(testimonial, "Testimonial submitted for review.")
        );
    });
    getAdminTestimonials = asyncHandler(async (req: Request, res: Response) => {
        const result = await testimonialRepository.getAdminTestimonials({
            stars: req.query.stars
                ? (req.query.stars as string).split(",").map(Number)
                : undefined,
            status: req.query.status as TestimonialStatus,
            startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
            endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
            page: req.query.page ? Number(req.query.page) : 1,
            limit: req.query.limit ? Number(req.query.limit) : 20,
        });

        res.status(200).json(ApiResponse.ok(result));
    });
    updateStatus = asyncHandler(async (req: Request, res: Response) => {
        const { status } = req.body;

        const testimonial = await testimonialRepository.updateStatus(
            getParam(req.params.id),
            status
        );

        if (!testimonial) throw ApiError.notFound("Testimonial not found.");

        res.status(200).json(
            ApiResponse.ok(
                testimonial,
                `Testimonial ${status} successfully.`
            )
        );
    });
}

export const testimonialController = new TestimonialController();