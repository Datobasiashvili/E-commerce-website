const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const productSchema = Joi.object({
  title: Joi.string().min(1).required(),
  price: Joi.number().min(0).required(),
  brand: Joi.string().min(1),
  warrantyInformation: Joi.string()
    .pattern(/^\d+\s+(month|year)s?$/i)
    .optional()
    .messages({
      "string.pattern.base": "Warranty information must be in the format '1 month', '2 years', etc."
    }),
  category: Joi.string().min(1).required(),
  description: Joi.string().min(1).required(),
  stock: Joi.number().min(0),
  images: Joi.array().items(Joi.string().uri().required()),
  thumbnail: Joi.string().uri().required(),
});

module.exports = { userSchema, productSchema };
