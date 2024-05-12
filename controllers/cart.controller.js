const cartService = require("../services/cart.services");
const rs = require("../helpers/error");
const { productId, quantity } = require("../validations/product.validation");
const validator = require("../helpers/validator");

module.exports = {
  index: async (req, res) => {
    try {
      if (!req.user) {
        rs.unauthorized(res, "Unauthorized");
      }
      const response = await cartService.index(req.user);
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
        { productId, quantity },
        {
          ...req.params,
          ...req.query,
        }
      );
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      if (!req.user) {
        rs.unauthorized(res, "Unauthorized");
      }
      const response = await cartService.create({
        ...req.user,
        ...req.params,
        ...req.query,
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
  update: async (req, res) => {
    try {
      const productId = req.params.productId;
      const response = await cartService.update(productId);
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
      if (!req.user) {
        rs.unauthorized(res, "Unauthorized");
      }
      const { error } = validator({ productId }, req.params);
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await cartService.destroy({
        ...req.user,
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
};
