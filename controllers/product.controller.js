const productService = require("../services/product.services");
const rs = require("../helpers/error");
const {
  name,
  productId,
  categoryId,
  seller,
  description,
  price,
  stock,
  img,
} = require("../validations/product.validation");
const cloudinary = require("cloudinary").v2;
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
      const file = req.file;
      const { error } = validator(
        {
          name,
          categoryId,
          seller,
          description,
          price,
          stock,
          img,
        },
        {
          ...req.body,
          img: file?.path,
        }
      );

      if (error) {
        if (file) {
          cloudinary.uploader.destroy(file.filename);
        }
        return rs.validate(res, error.details[0].message);
      }

      const response = await productService.create(req.body, req.file);
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
      const file = req.file;
      const { error } = validator(
        {
          name,
          categoryId,
          seller,
          description,
          price,
          stock,
          img,
        },
        {
          ...req.body,
          img: file?.path,
        }
      );

      if (error) {
        if (file) {
          cloudinary.uploader.destroy(file?.filename);
        }
        return rs.validate(res, error.details[0].message);
      }
      const response = await productService.update(
        {
          ...req.body,
          ...req.params,
        },
        req.file
      );
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
