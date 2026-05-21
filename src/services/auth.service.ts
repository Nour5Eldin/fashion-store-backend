import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";
import { userRepository } from "../repositories/user.repository";
import { cartRepository } from "../repositories/cart.repository";
import { IUser } from "../models/user.model";
import { UserRole, UserGender } from "../types/enum";
import { cloudinary } from "../config/cloudinary";

export interface RegisterDTO {
    name: string;
    mobile: string;
    email?: string;
    password: string;
    gender: UserGender;
    emailConsent?: boolean;
}
export interface LoginDTO {
    mobile: string;
    password: string;
}
export interface GuestCartItem {
    productId: string;
    quantity: number;
    price: number;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface AuthResult {
    user: Partial<IUser>;
    tokens: AuthTokens;
}
export class AuthService {

    private generateTokens(userId: string, role: UserRole): AuthTokens {
        const accessOptions: SignOptions = {
            expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"],
        };

        const refreshOptions: SignOptions = {
            expiresIn: env.jwt.refreshExpiresIn as SignOptions["expiresIn"],
        };

        const accessToken = jwt.sign(
            { userId, role },
            env.jwt.secret,
            accessOptions
        );

        const refreshToken = jwt.sign(
            { userId, role },
            env.jwt.refreshSecret,
            refreshOptions
        );

        return { accessToken, refreshToken };
    }
    private formatUser(user: IUser): Partial<IUser> {
        return {
            _id: user._id,
            name: user.name,
            mobile: user.mobile,
            email: user.email,
            gender: user.gender,
            role: user.role,
            emailConsent: user.emailConsent,
            isActive: user.isActive,
            createdAt: user.createdAt,
        };
    }
    async register(
        dto: RegisterDTO,
        guestCart: GuestCartItem[] = []
    ): Promise<AuthResult> {
        const mobileTaken = await userRepository.isMobileTaken(dto.mobile);
        if (mobileTaken) {
            throw ApiError.badRequest("This mobile number is already registered.");
        }
        if (dto.email) {
            const emailToken = await userRepository.isEmailTaken(dto.email);
            if (emailToken) {
                throw ApiError.badRequest("This email address is already associated with an account.");
            }
        }
        const user = await userRepository.create({
            name: dto.name,
            mobile: dto.mobile,
            email: dto.email,
            password: dto.password,
            gender: dto.gender,
            emailConsent: dto.emailConsent ?? false,
            role: UserRole.USER,
            isActive: true
        });
        const tokens = this.generateTokens(
            user._id.toString(),
            user.role as UserRole
        );
        if (guestCart.length > 0) {
            await cartRepository.mergeGuestCart(
                user._id.toString(),
                guestCart
            );
        }
        return {
            user: this.formatUser(user),
            tokens,
        }
    }
    async login(
        dto: LoginDTO,
        guestCart: GuestCartItem[] = []
    ): Promise<AuthResult> {
        const user = await userRepository.findByMobile(dto.mobile);

        if (!user) {
            throw ApiError.unauthorized("Incorrect mobile number or password.");
        }
        if (user.isLocked()) {
            const lockTime = Math.ceil(
                (user.lockUntil!.getTime() - Date.now()) / 1000 / 60
            );
            throw ApiError.unauthorized(
                `Too many attempts. Try again in ${lockTime} minutes.`
            );
        }
        if (!user.isActive) {
            throw ApiError.unauthorized(
                "Your account has been suspended. Please contact support."
            );
        }
        const isPasswordValid = await user.comparePassword(dto.password);

        if (!isPasswordValid) {
            await user.incrementLoginAttempts();
            throw ApiError.unauthorized("Incorrect mobile number or password.");
        }
        await user.resetLoginAttempts();
        const tokens = this.generateTokens(
            user._id.toString(),
            user.role as UserRole
        );
        if (guestCart.length > 0) {
            await cartRepository.mergeGuestCart(
                user._id.toString(),
                guestCart
            );
        }

        return {
            user: this.formatUser(user),
            tokens,
        };
    }
    async refreshToken(token: string): Promise<{ accessToken: string }> {
        try {
            const decoded = jwt.verify(token, env.jwt.refreshSecret) as {
                userId: string,
                role: UserRole;
            }
            const user = await userRepository.findById(decoded.userId);
            if (!user || !user.isActive) {
                throw ApiError.unauthorized("Invalid refresh token.")
            }
            const accessOptions: SignOptions = {
                expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"],
            };
            const accessToken = jwt.sign(
                { userId: decoded.userId, role: decoded.role },
                env.jwt.secret,
                accessOptions
            );
            return { accessToken };
        } catch {
            throw ApiError.unauthorized("Invalid or expired refresh token.");
        }
    }
    async forgotPasswordRequest(mobile: string): Promise<{ otp: string }> {
        const user = await userRepository.findByMobile(mobile);

        if (!user) {
            throw ApiError.notFound("No account found with this mobile number.");
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await userRepository.updateById(user._id.toString(), {
            resetOtp: otp,
            resetOtpExpiry: new Date(Date.now() + 10 * 60 * 1000),
            resetOtpAttempts: 0,
        });
        if (env.isDev) return { otp };
        return { otp: "" };
    }
    async verifyOtp(mobile: string, otp: string): Promise<{ verified: boolean }> {
        const user = await userRepository.findOne({
            mobile,
            resetOtp: otp,
            resetOtpExpiry: { $gt: new Date() },
        });

        if (!user) {
            await userRepository.updateOne(
                { mobile },
                { $inc: { resetOtpAttempts: 1 } }
            );
            throw ApiError.badRequest("Incorrect or expired OTP.");
        }

        return { verified: true };
    }
    async resetPassword(
        mobile: string,
        otp: string,
        newPassword: string
    ): Promise<void> {
        const user = await userRepository.findOne({
            mobile,
            resetOtp: otp,
            resetOtpExpiry: { $gt: new Date() },
        });

        if (!user) {
            throw ApiError.badRequest("Invalid or expired OTP.");
        }

        user.set("password", newPassword);
        user.set("resetOtp", undefined);
        user.set("resetOtpExpiry", undefined);
        user.set("resetOtpAttempts", 0);
        await user.save();
    }

    async updateProfile(
        userId: string,
        data: {
            name?: string;
            email?: string;
            gender?: "male" | "female";
            emailConsent?: boolean;
        }
    ): Promise<Partial<IUser>> {
        if (data.email) {
            const emailTaken = await userRepository.isEmailTaken(data.email, userId);
            if (emailTaken) {
                throw ApiError.badRequest(
                    "This email is already associated with another account."
                );
            }
        }
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found.");

        Object.assign(user, data);
        await user.save();

        return this.formatUser(user);
    }
    async changePassword(
        userId: string,
        currentPassword: string,
        newPassword: string
    ): Promise<void> {
        const user = await userRepository.findByMobile(
            (await userRepository.findById(userId))!.mobile
        );

        if (!user) throw ApiError.notFound("User not found.");

        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            throw ApiError.badRequest("Current password is incorrect.");
        }

        user.set("password", newPassword);
        await user.save();
    }
    async uploadAvatar(
        userId: string,
        imagePath: string,
    ): Promise<Partial<IUser>> {
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found.");
        if (user.avatar && user.avatar !== env.defaultAvatarUrl) {
            try {
                const urlParts = user.avatar.split("/");
                const fileName = urlParts[urlParts.length - 1];
                const publicId = `fashion-store/avatars/${fileName.split(".")[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch {
                console.warn("Could not delete old avatar from Cloudinary.");
            }
        }
        const uploadResult = await cloudinary.uploader.upload(imagePath, {
            folder: "fashion-store/avatars",
            transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" },
            ]
        });
        user.set("avatar", uploadResult.secure_url);
        await user.save();
        return this.formatUser(user);
    }
    async removeAvatar(userId: string): Promise<Partial<IUser>> {
        const user = await userRepository.findById(userId);
        if (!user) throw ApiError.notFound("User not found");
        if (user.avatar && user.avatar !== env.defaultAvatarUrl) {
            try {
                const urlParts = user.avatar.split("/");
                const fileName = urlParts[urlParts.length - 1];
                const publicId = `fashion-store/avatars/${fileName.split(".")[0]}`;
                await cloudinary.uploader.destroy(publicId);
            } catch (err) {
                console.warn("Could not delete avatar from Cloudinary.");
            }
        }
        user.set("avatar", env.defaultAvatarUrl);
        await user.save();
        return this.formatUser(user);

    }
}
export const authService = new AuthService();