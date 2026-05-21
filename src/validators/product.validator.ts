import Joi from "joi";

export const createProductSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.min":  "Product name must be at least 2 characters.",
      "string.max":  "Product name must not exceed 100 characters.",
      "any.required": "Product name is required.",
    }),

  description: Joi.string()
    .required()
    .messages({ "any.required": "Description is required." }),

  price: Joi.number()
    .positive()
    .required()
    .messages({
      "number.positive": "Price must be greater than 0.",
      "any.required":    "Price is required.",
    }),

  stock: Joi.number()
    .integer()
    .min(0)
    .required()
    .messages({
      "number.min":  "Stock cannot be negative.",
      "any.required": "Stock is required.",
    }),

  categoryId: Joi.string()
    .required()
    .messages({ "any.required": "Category is required." }),

  subCategoryId: Joi.string()
    .required()
    .messages({ "any.required": "Subcategory is required." }),

  isActive: Joi.boolean().default(true),
});

export const updateProductSchema = Joi.object({
  name:          Joi.string().min(2).max(100).optional(),
  description:   Joi.string().optional(),
  price:         Joi.number().positive().optional(),
  stock:         Joi.number().integer().min(0).optional(),
  categoryId:    Joi.string().optional(),
  subCategoryId: Joi.string().optional(),
  isActive:      Joi.boolean().optional(),
}).min(1).messages({
  "object.min": "At least one field must be provided for update.",
});

export const productFiltersSchema = Joi.object({
  categoryId:    Joi.string().optional(),
  subCategoryId: Joi.string().optional(),
  minPrice:      Joi.number().min(0).optional(),
  maxPrice:      Joi.number().min(0).optional(),
  search:        Joi.string().min(1).max(100).optional(),
  page:          Joi.number().integer().min(1).default(1),
  limit:         Joi.number().integer().min(1).max(100).default(20),
  sortBy: Joi.string()
    .valid("newest", "price_asc", "price_desc", "best_sellers")
    .default("newest"),
}).options({ allowUnknown: false });