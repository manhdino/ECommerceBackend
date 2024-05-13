const userServices = require("../services/user.services");
const rs = require("../helpers/error");
const {
  username,
  fullname,
  email,
  phone,
  address,
} = require("../validations/user.validation");
const validator = require("../helpers/validator");
module.exports = {
  index: async (req, res) => {
    try {
      const response = await userServices.index();
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
      const userIdParam = req.params.userId;
      const userId = req.user.userId;
      const role = req.user.role;
      if (!(role == "admin" || userId == userIdParam)) {
        return rs.unauthorized(res, "Unauthorized");
      }
      const response = await userServices.show(userIdParam);
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
      const userIdParam = req.params.userId;
      const userId = req.user.userId;
      const role = req.user.role;
      if (!(role == "admin" || userId == userIdParam)) {
        return rs.unauthorized(res, "Unauthorized");
      }

      const { error } = validator(
        { username, fullname, email, address, phone },
        req.body
      );
      if (error) {
        return rs.validate(res, error.details[0].message);
      }
      const response = await userServices.update(req.body, userIdParam);
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
      const userId = req.params.userId;
      const response = await userServices.destroy(userId);
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
