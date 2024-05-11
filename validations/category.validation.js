const Joi = require("joi");

module.exports = {
  name: Joi.string().max(30).required(),
  categoryId: Joi.number().integer().required(),
};
