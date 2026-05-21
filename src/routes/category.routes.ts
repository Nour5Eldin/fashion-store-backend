import { Router } from "express";
import { categoryController } from "../controllers";

const router = Router();

// Public
router.get("/", categoryController.getCategories);
router.get("/sub", categoryController.getSubcategories);
router.get("/header", categoryController.getHeaderCategories);

export default router;