const Joi = require("joi");

module.exports = {
  name: Joi.string().max(100),
  categoryId: Joi.number().integer(),
  productId: Joi.number().integer().required(),
  description: Joi.string(),
  quantity: Joi.number().integer(),
  seller: Joi.string().max(20),
  price: Joi.number(),
  stock: Joi.number().integer(),
  img: Joi.string(),
};
