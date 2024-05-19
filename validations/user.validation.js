const Joi = require("joi");

module.exports = {
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,20}@gmail.com$/)
    .messages({
      "string.pattern.base":
        "Email is not a valid pattern example214@gmail.com",
    })
    .required(),
  oldPassword: Joi.string().min(8).required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Password and confirm password do not match",
    })
    .required(),
  username: Joi.string().max(50).required(),
  fullname: Joi.string().max(100).required(),
  phone: Joi.string().required(),
  address: Joi.string().required(),
};

