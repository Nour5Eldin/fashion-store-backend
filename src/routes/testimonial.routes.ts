import { Router } from "express";
import { testimonialController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createTestimonialSchema } from "../validators/testimonial.validator";

const router = Router();

// Public
router.get("/", testimonialController.getApproved);

// Protected
router.post(
    "/",
    authenticate,
    validate(createTestimonialSchema),
    testimonialController.createTestimonial
);

export default router;