const Joi = require("joi");

module.exports = {
  email: Joi.string()
    .pattern(/^[a-zA-Z0-9]{8,20}@gmail.com$/)
    .messages({
      "string.pattern.base":
        "Email is not a valid pattern example214@gmail.com",
    })
    .required(),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .messages({
      "any.only": "Password and confirm password do not match",
    })
    .required(),
  phone: Joi.string()
    .pattern(/^\d{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be 10 digits",
    })
    .required(),
};
