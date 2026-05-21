import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { authService } from "../services/auth.service";

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { confirmPassword, ...dto } = req.body;
    const guestCart = req.body.guestCart || [];
    const result = await authService.register(dto, guestCart);
    res.status(201).json(
      ApiResponse.created(result, "Account created successfully.")
    );
  })
  login = asyncHandler(async (req: Request, res: Response) => {
    const { mobile, password } = req.body;
    const guestCart = req.body.guestCart || [];

    const result = await authService.login({ mobile, password }, guestCart);

    res.status(200).json(
      ApiResponse.ok(result, "Login successful.")
    );
  });
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json(
        ApiResponse.badRequest("Refresh token is required.")
      );
      return;
    }

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json(
      ApiResponse.ok(result, "Token refreshed successfully.")
    );
  });
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { mobile } = req.body;
    const result = await authService.forgotPasswordRequest(mobile);

    res.status(200).json(
      ApiResponse.ok(result, "OTP sent successfully.")
    );
  });
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { mobile, otp } = req.body;
    const result = await authService.verifyOtp(mobile, otp);

    res.status(200).json(
      ApiResponse.ok(result, "OTP verified successfully.")
    );
  });
  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { mobile, otp, newPassword } = req.body;
    await authService.resetPassword(mobile, otp, newPassword);

    res.status(200).json(
      ApiResponse.ok(null, "Password reset successfully.")
    );
  });
  getMe = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.updateProfile(req.user!.userId, {});

    res.status(200).json(
      ApiResponse.ok(user, "Profile fetched successfully.")
    );
  });
  uploadAvatar = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json(ApiResponse.badRequest("Image is required."));
      return;
    }

    const user = await authService.uploadAvatar(
      req.user!.userId,
      req.file.path
    );

    res.status(200).json(
      ApiResponse.ok(user, "Profile picture updated successfully.")
    );
  });
  removeAvatar = asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.removeAvatar(req.user!.userId);

    res.status(200).json(
      ApiResponse.ok(user, "Profile picture removed successfully.")
    );
  });
  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.updateProfile(
      req.user!.userId,
      req.body
    );
    res.status(200).json(
      ApiResponse.ok(result, "Profile updated successfully.")
    );
  });
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;

    await authService.changePassword(
      req.user!.userId,
      currentPassword,
      newPassword
    );

    res.status(200).json(
      ApiResponse.ok(null, "Password changed successfully.")
    );
  });

}
export const authController = new AuthController();