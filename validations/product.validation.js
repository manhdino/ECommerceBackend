const Joi = require("joi");

module.exports = {
  name: Joi.string().max(100),
  productId: Joi.number().integer().required(),
  categoryId: Joi.number().integer(),
  description: Joi.string(),
  seller: Joi.string().max(20),
  price: Joi.number(),
  quantity: Joi.number().integer(),
  ratings: Joi.number().integer(),
  stock: Joi.number().integer(),
  img: Joi.string(),
};
