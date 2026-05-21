import { Router } from "express";
import { cartController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { addToCartSchema, updateCartSchema } from "../validators/cart.validator";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get("/", cartController.getCart);
router.get("/count", cartController.getCartCount);
router.post("/", validate(addToCartSchema), cartController.addItem);
router.patch("/:itemId", validate(updateCartSchema), cartController.updateItem);
router.delete("/:itemId", cartController.removeItem);
router.post("/:itemId/re-add", cartController.reAddItem);

export default router;