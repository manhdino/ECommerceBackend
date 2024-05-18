const Joi = require("joi");

module.exports = {
  name: Joi.string().max(100).required(),
  productId: Joi.number().integer().required(),
  categoryId: Joi.number().integer().required(),
  description: Joi.string().required(),
  seller: Joi.string().max(20).required(),
  price: Joi.number().required(),
  stock: Joi.number().integer(),
  img: Joi.string().required(),
};
