import { Router } from "express";
import { authController } from "../controllers";
import { authenticate } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate.middleware";
import { registerSchema,loginSchema,forgotPasswordSchema,verifyOtpSchema,resetPasswordSchema,updateProfileSchema,changePasswordSchema } from "../validators/auth.validator";
import { uploadImage } from "../middleware/upload.middleware";

const router = Router();

// Public routes
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/refresh", authController.refreshToken);
router.post("/forgot-password", validate(forgotPasswordSchema), authController.forgotPassword);
router.post("/verify-otp", validate(verifyOtpSchema), authController.verifyOtp);
router.post("/reset-password", validate(resetPasswordSchema), authController.resetPassword);

// Protected routes
router.get("/me", authenticate, authController.getMe);
router.patch("/profile", authenticate, validate(updateProfileSchema), authController.updateProfile);
router.post(
  "/avatar",
  authenticate,
  uploadImage.single("avatar"),
  authController.uploadAvatar
);
router.delete(
  "/avatar",
  authenticate,
  authController.removeAvatar
);

router.patch("/change-password", authenticate, validate(changePasswordSchema), authController.changePassword);
export default router;