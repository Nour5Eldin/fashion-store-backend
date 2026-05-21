import Joi from "joi";
import { UserGender } from "../types/enum";

export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(60)
    .required()
    .messages({
      "string.min":  "Name must be at least 2 characters.",
      "string.max":  "Name must not exceed 60 characters.",
      "any.required": "Name is required.",
    }),

  mobile: Joi.string()
    .pattern(/^\+[1-9]\d{6,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Enter a valid phone number with country code.",
      "any.required":        "Mobile number is required.",
    }),

  email: Joi.string()
    .email()
    .optional()
    .messages({
      "string.email": "Please enter a valid email address.",
    }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min":          "Password must be at least 8 characters.",
      "string.pattern.base": "Password must contain at least one letter and one number.",
      "any.required":        "Password is required.",
    }),

  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only":    "Passwords do not match.",
      "any.required": "Please confirm your password.",
    }),

  gender: Joi.string()
    .valid(...Object.values(UserGender))
    .required()
    .messages({
      "any.only":    "Gender must be male or female.",
      "any.required": "Gender is required.",
    }),

  emailConsent: Joi.boolean().default(false),
});

export const loginSchema = Joi.object({
  mobile: Joi.string()
    .required()
    .messages({ "any.required": "Mobile number is required." }),

  password: Joi.string()
    .required()
    .messages({ "any.required": "Password is required." }),
});

export const forgotPasswordSchema = Joi.object({
  mobile: Joi.string()
    .pattern(/^\+[1-9]\d{6,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Enter a valid phone number with country code.",
      "any.required":        "Mobile number is required.",
    }),
});

export const verifyOtpSchema = Joi.object({
  mobile: Joi.string().required(),
  otp:    Joi.string().length(6).required().messages({
    "string.length": "OTP must be 6 digits.",
    "any.required":  "OTP is required.",
  }),
});

export const resetPasswordSchema = Joi.object({
  mobile: Joi.string().required(),
  otp:    Joi.string().length(6).required(),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min":          "Password must be at least 8 characters.",
      "string.pattern.base": "Password must contain at least one letter and one number.",
      "any.required":        "New password is required.",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Passwords do not match." }),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "any.required": "Current password is required.",
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
    .required()
    .messages({
      "string.min":          "Password must be at least 8 characters.",
      "string.pattern.base": "Password must contain at least one letter and one number.",
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({ "any.only": "Passwords do not match." }),
});

export const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(60).optional(),
  email: Joi.string().email().optional(),
  gender: Joi.string().valid(...Object.values(UserGender)).optional(),
  emailConsent: Joi.boolean().optional(),
});