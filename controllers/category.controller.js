const categoryService = require("../services/category.services");
const rs = require("../helpers/error");

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
      const categoryId = req.params.categoryId;
      const response = await categoryService.show(categoryId);
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
      const { name } = req.body;
      const response = await categoryService.create(name);
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
      const { name } = req.body;
      const { categoryId } = req.params;
      const response = await categoryService.update(categoryId, name);
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
      const { categoryId } = req.params;
      const response = await categoryService.destroy(categoryId);
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
