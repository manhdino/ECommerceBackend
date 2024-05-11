const categoryService = require("../services/category.services");
const rs = require("../helpers/error");
const Joi = require("joi");
module.exports = {
  index: async (req, res) => {
    try {
      const response = await categoryService.index();
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.success(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const { error } = Joi.object({
        categoryId: Joi.number().integer().required(),
      }).validate(req.params, {
        errors: { wrap: { label: "" } },
      });
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await categoryService.show(req.params);
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.success(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  create: async (req, res) => {
    try {
      const { error } = Joi.object({
        name: Joi.string().max(30).required(),
      }).validate(req.body, {
        errors: { wrap: { label: "" } },
      });

      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await categoryService.create(req.body);
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.success(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  update: async (req, res) => {
    try {
      const { error } = Joi.object({
        name: Joi.string().max(30).required(),
        categoryId: Joi.number().integer().required(),
      }).validate(
        { ...req.body, ...req.params },
        {
          errors: { wrap: { label: "" } },
        }
      );

      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await categoryService.update({
        ...req.body,
        ...req.params,
      });
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.success(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  destroy: async (req, res) => {
    try {
      const { error } = Joi.object({
        categoryId: Joi.number().integer().required(),
      }).validate(req.params, {
        errors: { wrap: { label: "" } },
      });
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await categoryService.destroy(req.params);
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.success(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
};
