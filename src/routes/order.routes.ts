import { Router } from "express";
import { orderController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { placeOrderSchema,refundRequestSchema } from "../validators/order.validator";

const router = Router();


router.use(authenticate);

router.post("/", validate(placeOrderSchema), orderController.placeOrder);
router.get("/", orderController.getUserOrders);
router.get("/:id", orderController.getOrderDetail);
router.patch("/:id/cancel", orderController.cancelOrder);
router.post("/:id/refund", validate(refundRequestSchema), orderController.requestRefund);

export default router;