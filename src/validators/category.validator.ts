import Joi from "joi";

export const createCategorySchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(60)
    .required()
    .messages({
      "string.min":  "Title must be at least 2 characters.",
      "string.max":  "Title must not exceed 60 characters.",
      "any.required": "Category title is required.",
    }),
  isActive: Joi.boolean().default(true),
});

export const updateCategorySchema = Joi.object({
  title:    Joi.string().min(2).max(60).optional(),
  isActive: Joi.boolean().optional(),
}).min(1);

export const createSubcategorySchema = Joi.object({
  title: Joi.string()
    .min(2)
    .max(60)
    .required()
    .messages({
      "string.min":  "Title must be at least 2 characters.",
      "string.max":  "Title must not exceed 60 characters.",
      "any.required": "Subcategory title is required.",
    }),
  categoryId: Joi.string()
    .required()
    .messages({ "any.required": "Category is required." }),
  isActive: Joi.boolean().default(true),
});

export const updateSubcategorySchema = Joi.object({
  title:      Joi.string().min(2).max(60).optional(),
  categoryId: Joi.string().optional(),
  isActive:   Joi.boolean().optional(),
}).min(1);