const productService = require("../services/product.services");
const rs = require("../helpers/error");
const {
  name,
  productId,
  categoryId,
  seller,
  description,
  price,
  quantity,
  stock,
  ratings,
  img,
} = require("../validations/product.validation");
const validator = require("../helpers/validator");
module.exports = {
  index: async (req, res) => {
    try {
      const response = await productService.index();
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
      const { error } = validator({ productId }, req.params);
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await productService.show(req.params);
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
  list: async (req, res) => {
    try {
      const { error } = validator({ categoryId }, req.params);
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await productService.list(req.params);
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
      const { error } = validator(
        {
          name,
          categoryId,
          seller,
          description,
          price,
          quantity,
          ratings,
          stock,
          img,
        },
        req.body
      );
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await productService.create(req.body);
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
      const { error } = validator(
        {
          name,
          productId,
          categoryId,
          seller,
          description,
          price,
          quantity,
          ratings,
          stock,
          img,
        },
        {
          ...req.body,
          ...req.params,
        }
      );
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await productService.update({
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
      const { error } = validator({ productId }, req.params);
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await productService.destroy(req.params);
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
