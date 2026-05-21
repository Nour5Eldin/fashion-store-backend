import Joi from "joi";

export const createTestimonialSchema = Joi.object({
  stars: Joi.number()
    .integer()
    .min(1)
    .max(5)
    .required()
    .messages({
      "number.min":  "Rating must be at least 1 star.",
      "number.max":  "Rating must not exceed 5 stars.",
      "any.required": "Star rating is required.",
    }),

  comment: Joi.string()
    .min(10)
    .max(500)
    .required()
    .messages({
      "string.min":  "Comment must be at least 10 characters.",
      "string.max":  "Comment must not exceed 500 characters.",
      "any.required": "Comment is required.",
    }),
});