const userServices = require("../services/user.services");
const rs = require("../helpers/error");
const {
  username,
  fullname,
  email,
  phone,
  address,
  oldPassword,
  password,
  confirmPassword,
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
  updatePassword: async (req, res) => {
    try {
      const userIdParam = req.params.userId;
      const userId = req.user.userId;
      const role = req.user.role;
      if (!(role == "admin" || userId == userIdParam)) {
        return rs.unauthorized(res, "Unauthorized");
      }
      const { error } = validator(
        { oldPassword, password, confirmPassword },
        req.body
      );
      if (error) {
        return rs.validate(res, error.details[0].message);
      }

      const response = await userServices.updatePassword(req.body, userIdParam);

      if (response.error) {
        return rs.error(res, response.error);
      }
      const data = response.data;
      if (response) {
        res
          .status(200)
          .cookie("access_token", response.data.access_token)
          .send({
            success: true,
            data,
            status: 200,
            message: "ok",
          });
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  destroy: async (req, res) => {
    try {
      const userIdParam = req.params.userId;
      const userId = req.user.userId;
      if (userId == userIdParam) {
        return rs.error(
          res,
          "It's not allowed to delete the user who is currently logged in."
        );
      }

      const response = await userServices.destroy(userIdParam);
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