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

const reviewSchema = Joi.object({
<<<<<<< HEAD
  comment: Joi.string().min(5).max(1000).required(),
  rating: Joi.number().integer().min(1).max(5).required()
});
=======
  comment: Joi.string().min(3).max(500).required(),
  rating: Joi.number().integer().min(1).max(5),
})

>>>>>>> ddd6f5e2493fe3f07c819747f4d2599ccaa64c16
module.exports = { userSchema, productSchema, reviewSchema };
