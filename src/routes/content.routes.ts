import { Router } from "express";
import { contentController } from "../controllers";

const router = Router();

router.get("/slides", contentController.getPublicSlides);
router.get("/campaign", contentController.getPublicCampaign);

export default router;
