const userServices = require("../services/user.services");
const rs = require("../helpers/error");

module.exports = {
  index: async (req, res) => {
    try {
      const response = await userServices.index();
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.ok(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  show: async (req, res) => {
    try {
      const userId = req.params.userId;
      const response = await userServices.show(userId);
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.ok(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  create: async (req, res) => {
    try {
      const { role, userId } = req.user;

      if (!userId && role != "owner") {
        return rs.authorization(res, "Unauthorized");
      }
      const { error } = validation.create({ ...req.body, ...req.query });
      if (error) {
        return rs.error(res, error.details[0].message);
      }
      const response = await postService.create({
        ...req.body,
        ...req.query,
        userId,
      });
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.ok(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  update: async (req, res) => {
    try {
      const { role, userId } = req.user;

      if (!userId && role != "owner") {
        return rs.authorization(res, "Unauthorized");
      }

      const { error } = validation.update({
        ...req.body,
        ...req.query,
        ...req.params,
      });
      if (error) {
        return rs.error(res, error.details[0].message);
      }
      const response = await postService.update({
        ...req.body,
        ...req.query,
        ...req.params,
        userId,
      });
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.ok(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  destroy: async (req, res) => {
    try {
      const { role, userId } = req.user;

      if (!userId && role != "owner") {
        return rs.authorization(res, "Unauthorized");
      }
      const { error } = validation.destroy(req.params);
      if (error) {
        return rs.error(res, error.details[0].message);
      }
      const response = await postService.destroy({ ...req.params, userId });
      if (response.error) {
        return rs.error(res, response.error);
      }
      if (response) {
        return rs.ok(res, response);
      }
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
};
