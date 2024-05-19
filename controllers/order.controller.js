const orderService = require("../services/order.services");
const rs = require("../helpers/error");
const {
  orderId,
  paymentMethod,
  amount,
  status,
} = require("../validations/order.validation");
const validator = require("../helpers/validator");
module.exports = {
  index: async (req, res) => {
    try {
      if (!req.user) {
        rs.unauthorized(res, "Unauthorized");
      }
      const response = await orderService.index(req.user);
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
      const { error } = validator({ orderId }, req.params);
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await orderService.show({
        ...req.params,
        ...req.user,
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
  create: async (req, res) => {
    try {
      if (!req.user) {
        rs.unauthorized(res, "Unauthorized");
      }
      const { error } = validator({ paymentMethod, amount }, req.body);
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await orderService.create({ ...req.body, ...req.user });
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
      if (!req.user) {
        rs.unauthorized(res, "Unauthorized");
      }
      const { error } = validator(
        { orderId, status },
        {
          ...req.params,
          ...req.query,
        }
      );
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await orderService.update({
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
  destroy: async (req, res) => {
    try {
      const { error } = validator({ orderId }, req.params);
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await orderService.destroy({
        ...req.params,
        ...req.user,
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
