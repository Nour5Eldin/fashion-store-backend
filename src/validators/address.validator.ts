import Joi from "joi";
import { AddressLabel } from "../types/enum";

export const createAddressSchema = Joi.object({
  label: Joi.string()
    .valid(...Object.values(AddressLabel))
    .required()
    .messages({
      "any.only":    "Label must be home, work, or other.",
      "any.required": "Address label is required.",
    }),

  addressText: Joi.string()
    .min(10)
    .required()
    .messages({
      "string.min":  "Address must be at least 10 characters.",
      "any.required": "Address text is required.",
    }),

  isDefault: Joi.boolean().default(false),
});

export const updateAddressSchema = Joi.object({
  label:       Joi.string().valid(...Object.values(AddressLabel)).optional(),
  addressText: Joi.string().min(10).optional(),
  isDefault:   Joi.boolean().optional(),
}).min(1);