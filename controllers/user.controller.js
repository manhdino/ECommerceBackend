const userServices = require("../services/user.services");
const rs = require("../helpers/error");
const validator = require("../helpers/validator");
const validation = require("../validations/auth.validation");

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
  // show: async (req, res) => {
  //   try {
  //     const { userId, role } = req.user;
  //     const userIdParam = req.params.userId;
  //     if (userIdParam != userId || role != "admin") {
  //       return rs.unauthorized(res, "Unauthorized");
  //     }
  //     const response = await userServices.show(userId);
  //     if (response.error) {
  //       return rs.error(res, response.error);
  //     }
  //     if (response) {
  //       return rs.success(res, response);
  //     }
  //   } catch (error) {
  //     return rs.error(res, error.message);
  //   }
  // },
  show: async (req, res) => {
    try {
      const userId = req.user.userId;
      const response = await userServices.show(userId);
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.success(res, response);
      }
    }
    catch(err) {
      return rs.error(res, err.message);
    }
  },
  update: async (req, res) => {
    try {
      const userId = req.user.userId;
      const data = {email: req.body.email, phone: req.body.phone}
      const { error } = validator(
        { email, phone },
        data
      );
        if (error) {
          return rs.validate(res, error.details[0].message);
        }
      const response = await userServices.update(userId, req.body);
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
      const userId = req.user.userId;
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
