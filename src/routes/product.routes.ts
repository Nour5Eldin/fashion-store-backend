import { Router } from "express";
import { productController } from "../controllers";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";
import { uploadImage } from "../middleware/upload.middleware";
import { validate } from "../middleware/validate.middleware";
import { createProductSchema,updateProductSchema,} from "../validators/product.validator";
import reviewRoutes from "./review.routes";

const router = Router();

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/", productController.getProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/best-sellers", productController.getBestSellers);
router.get("/:slug", productController.getProductBySlug);
router.get("/:slug/related", productController.getRelatedProducts);
router.use("/:productId/reviews", reviewRoutes);
export default router;