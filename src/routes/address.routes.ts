import { Router } from "express";
import { addressController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { createAddressSchema,updateAddressSchema } from "../validators/address.validator";

const router = Router();

router.use(authenticate);

router.get("/", addressController.getAddresses);
router.post("/", validate(createAddressSchema), addressController.createAddress);
router.patch("/:id", validate(updateAddressSchema), addressController.updateAddress);
router.delete("/:id", addressController.deleteAddress);
router.patch("/:id/set-default", addressController.setDefault);

export default router;