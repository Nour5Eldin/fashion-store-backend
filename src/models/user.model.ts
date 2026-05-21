import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { UserRole, UserGender } from "../types/enum";

export interface IUser extends Document {
    name: string;
    mobile: string;
    email?: string;
    avatar?: string;
    password: string;
    gender: UserGender;
    role: UserRole;
    emailConsent: boolean;
    isActive: boolean;
    loginAttempts: number;
    lockUntil?: Date;
    createdAt: Date;
    updatedAt: Date;

    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>;
    isLocked(): boolean;
    incrementLoginAttempts(): Promise<void>;
    resetLoginAttempts(): Promise<void>;
    resetOtp?: string;
    resetOtpExpiry?: Date;
    resetOtpAttempts?: number;
}

interface IUserModel extends Model<IUser> {
    findByMobile(mobile: string): Promise<IUser | null>;
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [60, "Name must not exceed 60 characters"],
        },

        mobile: {
            type: String,
            required: [true, "Mobile is required"],
            unique: true,
            trim: true,
            match: [
                /^\+[1-9]\d{6,14}$/,
                "Please enter a valid mobile number with country code (e.g. +201012345678)",
            ],
        },
        avatar: {
            type: String,
            default: process.env.DEFAULT_AVATAR_URL || null,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        },

        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            select: false,
        },

        gender: {
            type: String,
            enum: Object.values(UserGender),
            required: [true, "Gender is required"],
        },

        role: {
            type: String,
            enum: Object.values(UserRole),
            default: UserRole.USER,
        },

        emailConsent: {
            type: Boolean,
            default: false,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        loginAttempts: {
            type: Number,
            default: 0,
            select: false,
        },

        lockUntil: {
            type: Date,
            select: false,
        },
        resetOtp: {
            type: String,
            select: false,
        },

        resetOtpExpiry: {
            type: Date,
            select: false,
        },

        resetOtpAttempts: {
            type: Number,
            default: 0,
            select: false,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform: (_doc, ret: Record<string, unknown>) => {
                ret["password"] = undefined;
                ret["loginAttempts"] = undefined;
                ret["lockUntil"] = undefined;
                ret["__v"] = undefined;
                return ret;
            },
        },
    }
);


userSchema.index({ mobile: 1 });
userSchema.index({ email: 1 }, { sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ createdAt: -1 });

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password as string, 10);
});

userSchema.methods.comparePassword = async function (
    candidatePassword: string
): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isLocked = function (): boolean {
    return !!(this.lockUntil && this.lockUntil > new Date());
};

userSchema.methods.incrementLoginAttempts = async function (): Promise<void> {
    const MAX_ATTEMPTS = 5;
    const LOCK_DURATION = 15 * 60 * 1000;

    this.loginAttempts += 1;

    if (this.loginAttempts >= MAX_ATTEMPTS) {
        await User.updateOne(
            { _id: this._id },
            {
                loginAttempts: 0,
                lockUntil: new Date(Date.now() + LOCK_DURATION),
            }
        );
    } else {
        await User.updateOne(
            { _id: this._id },
            { loginAttempts: this.loginAttempts }
        );
    }
};

userSchema.methods.resetLoginAttempts = async function (): Promise<void> {
    await User.updateOne(
        { _id: this._id },
        {
            loginAttempts: 0,
            $unset: { lockUntil: 1 },
        }
    );
};
userSchema.statics.findByMobile = function (
    mobile: string
): Promise<IUser | null> {
    return this.findOne({ mobile }).select("+password +loginAttempts +lockUntil");
};

export const User = mongoose.model<IUser, IUserModel>("User", userSchema);