import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { authenticate } from "../middleware/auth.middleware";
import { uploadImage } from "../middleware/upload.middleware";
import { validate } from "../middleware/validate.middleware";
import Joi from "joi";

const router = Router({ mergeParams: true });
const createReviewSchema = Joi.object({
    stars: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().min(10).max(1000).required(),
});
const updateReviewSchema = Joi.object({
    stars: Joi.number().integer().min(1).max(5).optional(),
    comment: Joi.string().min(10).max(1000).optional(),
}).min(1);

router.get("/", reviewController.getProductReviews);
router.post("/",authenticate,uploadImage.array("images", 3),validate(createReviewSchema),reviewController.createReview);
router.patch("/:id",authenticate,uploadImage.array("images", 3),validate(updateReviewSchema),reviewController.updateReview);
router.delete("/:id",authenticate,reviewController.deleteReview);

export default router;