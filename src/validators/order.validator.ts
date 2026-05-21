import Joi from "joi";
import { OrderStatus } from "../types/enum";

export const placeOrderSchema = Joi.object({
  addressId: Joi.string()
    .required()
    .messages({ "any.required": "Delivery address is required." }),

  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{6,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Enter a valid phone number with country code.",
      "any.required":        "Phone number is required.",
    }),

  guestCart: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity:  Joi.number().integer().min(1).required(),
      price:     Joi.number().positive().required(),
    })
  ).default([]),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required()
    .messages({
      "any.only":    `Status must be one of: ${Object.values(OrderStatus).join(", ")}`,
      "any.required": "Status is required.",
    }),
  note: Joi.string().optional(),
});

export const refundRequestSchema = Joi.object({
  reason: Joi.string()
    .min(20)
    .required()
    .messages({
      "string.min":  "Refund reason must be at least 20 characters.",
      "any.required": "Refund reason is required.",
    }),
});

export const salesReportSchema = Joi.object({
  startDate: Joi.date().required().messages({
    "any.required": "Start date is required.",
  }),
  endDate: Joi.date()
    .min(Joi.ref("startDate"))
    .required()
    .messages({
      "date.min":    "End date must be after start date.",
      "any.required": "End date is required.",
    }),
});