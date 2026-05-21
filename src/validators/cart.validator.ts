import Joi from "joi";

export const addToCartSchema = Joi.object({
  productId: Joi.string()
    .required()
    .messages({ "any.required": "Product ID is required." }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.min":  "Quantity must be at least 1.",
      "any.required": "Quantity is required.",
    }),
});

export const updateCartSchema = Joi.object({
  quantity: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.min":  "Quantity must be at least 1.",
      "any.required": "Quantity is required.",
    }),
});