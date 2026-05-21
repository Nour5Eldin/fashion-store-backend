import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { homeSlideRepository, siteConfigRepository } from "../repositories";
import { cloudinary } from "../config/cloudinary";
import { getParam } from "../utils/request.utils";

export class ContentController {
    // ─── Public Endpoints ──────────────────────────────────────────────────────

    getPublicSlides = asyncHandler(async (_req: Request, res: Response) => {
        const slides = await homeSlideRepository.getActiveSlides();
        res.status(200).json(ApiResponse.ok(slides));
    });

    getPublicCampaign = asyncHandler(async (_req: Request, res: Response) => {
        const campaign = await siteConfigRepository.getOrInitialize();
        res.status(200).json(ApiResponse.ok(campaign));
    });

    // ─── Admin Slides CRUD Endpoints ──────────────────────────────────────────

    adminGetSlides = asyncHandler(async (_req: Request, res: Response) => {
        const slides = await homeSlideRepository.findMany({}, { sort: { order: 1, createdAt: -1 } });
        res.status(200).json(ApiResponse.ok(slides));
    });

    adminCreateSlide = asyncHandler(async (req: Request, res: Response) => {
        const files = req.files as Express.Multer.File[];
        let imageUrl = req.body.image;

        // If a file is uploaded, upload to Cloudinary
        if (files && files.length > 0) {
            try {
                const uploadResult = await cloudinary.uploader.upload(files[0].path, {
                    folder: "fashion-store/slides",
                    transformation: [{ quality: "auto", fetch_format: "auto" }],
                });
                imageUrl = uploadResult.secure_url;
            } catch (err) {
                console.error("Cloudinary upload failed, using original file path if possible or throwing error.", err);
                throw ApiError.badRequest("Image upload failed. Please verify Cloudinary credentials or provide a direct image URL.");
            }
        }

        if (!imageUrl) {
            throw ApiError.badRequest("Slide image is required. Please upload an image file or provide a direct image URL.");
        }

        const order = req.body.order !== undefined ? Number(req.body.order) : 0;
        const isActive = req.body.isActive !== undefined ? req.body.isActive === "true" || req.body.isActive === true : true;

        const slide = await homeSlideRepository.create({
            image: imageUrl,
            label: req.body.label,
            title: req.body.title,
            description: req.body.description,
            cta: req.body.cta,
            link: req.body.link,
            order,
            isActive,
        });

        res.status(201).json(ApiResponse.created(slide, "Slide created successfully."));
    });

    adminUpdateSlide = asyncHandler(async (req: Request, res: Response) => {
        const id = getParam(req.params.id);
        const slide = await homeSlideRepository.findById(id);
        if (!slide) {
            throw ApiError.notFound("Slide not found.");
        }

        const files = req.files as Express.Multer.File[];
        let imageUrl = req.body.image;

        if (files && files.length > 0) {
            try {
                const uploadResult = await cloudinary.uploader.upload(files[0].path, {
                    folder: "fashion-store/slides",
                    transformation: [{ quality: "auto", fetch_format: "auto" }],
                });
                imageUrl = uploadResult.secure_url;
            } catch (err) {
                console.error("Cloudinary upload failed", err);
                throw ApiError.badRequest("Image upload failed. Please check Cloudinary config.");
            }
        }

        const updateData: Record<string, any> = {};
        if (imageUrl) updateData.image = imageUrl;
        if (req.body.label !== undefined) updateData.label = req.body.label;
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = req.body.description;
        if (req.body.cta !== undefined) updateData.cta = req.body.cta;
        if (req.body.link !== undefined) updateData.link = req.body.link;
        if (req.body.order !== undefined) updateData.order = Number(req.body.order);
        if (req.body.isActive !== undefined) {
            updateData.isActive = req.body.isActive === "true" || req.body.isActive === true;
        }

        const updated = await homeSlideRepository.updateById(id, updateData);
        res.status(200).json(ApiResponse.ok(updated, "Slide updated successfully."));
    });

    adminDeleteSlide = asyncHandler(async (req: Request, res: Response) => {
        const id = getParam(req.params.id);
        const deleted = await homeSlideRepository.deleteById(id);
        if (!deleted) {
            throw ApiError.notFound("Slide not found.");
        }
        res.status(200).json(ApiResponse.ok(null, "Slide deleted successfully."));
    });

    // ─── Admin Campaign Settings Endpoints ────────────────────────────────────

    adminGetCampaign = asyncHandler(async (_req: Request, res: Response) => {
        const campaign = await siteConfigRepository.getOrInitialize();
        res.status(200).json(ApiResponse.ok(campaign));
    });

    adminUpdateCampaign = asyncHandler(async (req: Request, res: Response) => {
        const updated = await siteConfigRepository.updateCampaign({
            campaignTag: req.body.campaignTag,
            campaignTitle: req.body.campaignTitle,
            campaignDescription: req.body.campaignDescription,
            campaignBtnText: req.body.campaignBtnText,
            campaignBtnLink: req.body.campaignBtnLink,
        });
        res.status(200).json(ApiResponse.ok(updated, "Campaign settings updated successfully."));
    });
}

export const contentController = new ContentController();
