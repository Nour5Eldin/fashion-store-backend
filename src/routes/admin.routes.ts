import { Router } from "express";
import { authenticate, authorizeAdmin } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { uploadImage } from "../middleware/upload.middleware";
import { productController, orderController, testimonialController, categoryController, contentController } from "../controllers";
import {createProductSchema,updateProductSchema,} from "../validators/product.validator";
import { updateOrderStatusSchema } from "../validators/order.validator";
import { createCategorySchema, updateCategorySchema, createSubcategorySchema, updateSubcategorySchema } from "../validators/category.validator";
import { reviewController } from "../controllers/review.controller";

const router = Router();

// All admin routes require auth + admin role
router.use(authenticate, authorizeAdmin);

// ─── Products ─────────────────────────────────────────────────────────────────
router.get("/products", productController.getAdminProducts);
router.get("/products/low-stock", productController.getLowStock);
router.post("/products", uploadImage.array("image",5), validate(createProductSchema), productController.createProduct);
router.patch("/products/:id", uploadImage.array("image",5), validate(updateProductSchema), productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);
router.patch("/products/:id/toggle-active", productController.toggleActive);

// ─── Categories ───────────────────────────────────────────────────────────────
router.get("/categories", categoryController.getAdminCategories);
router.post("/categories", validate(createCategorySchema), categoryController.createCategory);
router.patch("/categories/:id", validate(updateCategorySchema), categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);
router.patch("/categories/:id/toggle-active", categoryController.toggleActive);

// ─── Subcategories ────────────────────────────────────────────────────────────
router.get("/subcategories", categoryController.getAdminSubcategories);
router.post("/subcategories", validate(createSubcategorySchema), categoryController.createSubcategory);
router.patch("/subcategories/:id", validate(updateSubcategorySchema), categoryController.updateSubcategory);
router.delete("/subcategories/:id", categoryController.deleteSubcategory);

// ─── Orders ───────────────────────────────────────────────────────────────────
router.get("/orders", orderController.getAdminOrders);
router.patch("/orders/:id/status", validate(updateOrderStatusSchema), orderController.updateOrderStatus);
router.patch("/orders/:id/refund", orderController.handleRefund);
router.get("/dashboard", orderController.getDashboardKPIs);
router.get("/reports/sales", orderController.getSalesReport);

// ─── Testimonials ─────────────────────────────────────────────────────────────
router.get("/testimonials", testimonialController.getAdminTestimonials);
router.patch("/testimonials/:id", testimonialController.updateStatus);
// ─── Reviews ─────────────────────────────────────────────────────────────
router.get("/reviews",            reviewController.getAdminReviews);
router.patch("/reviews/:id/toggle", reviewController.toggleApproval);

// ─── Content Management ───────────────────────────────────────────────────────
router.get("/content/slides", contentController.adminGetSlides);
router.post("/content/slides", uploadImage.array("image", 1), contentController.adminCreateSlide);
router.patch("/content/slides/:id", uploadImage.array("image", 1), contentController.adminUpdateSlide);
router.delete("/content/slides/:id", contentController.adminDeleteSlide);

router.get("/content/campaign", contentController.adminGetCampaign);
router.put("/content/campaign", contentController.adminUpdateCampaign);

export default router;