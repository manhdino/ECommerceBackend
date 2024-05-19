const Joi = require("joi");

module.exports = {
  orderId: Joi.number().integer().required(),
  paymentMethod: Joi.string().required().max(10),
  amount: Joi.number().required().required(),
  status: Joi.string().required().max(10),
};

