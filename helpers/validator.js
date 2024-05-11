const Joi = require("joi");

const validator = (fields, data) => {
  return Joi.object({ ...fields }).validate(data, {
    errors: { wrap: { label: "" } },
  });
};
module.exports = validator;
