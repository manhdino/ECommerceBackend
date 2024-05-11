const model = require("../database/models");
const { Op } = require("sequelize");
module.exports = {
  index: async () => {
    try {
      const response = await model.Product.findAll({
        attributes: { exclude: ["category_id"] },
        include: [
          {
            model: model.Category,
            as: "category",
          },
        ],
      });
      if (response) {
        return {
          data: response,
        };
      }
      return {
        error: "Cannot find resouces",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  show: async (data) => {
    try {
      const { productId } = data;
      const response = await model.Product.findOne({
        where: {
          id: productId,
        },
        attributes: { exclude: ["category_id"] },
        include: [
          {
            model: model.Category,
            as: "category",
          },
        ],
      });
      if (!response) {
        return {
          error: "Product not found",
        };
      }
      return {
        data: response,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  list: async (data) => {
    try {
      const { categoryId } = data;
      const checkCategory = await model.Category.findOne({
        where: {
          id: categoryId,
        },
      });
      if (!checkCategory) {
        return {
          error: "Category not found",
        };
      }
      const response = await model.Product.findAll({
        where: {
          category_id: categoryId,
        },
      });
      if (!response) {
        return {
          error: "Product not found",
        };
      }
      return {
        data: response,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  create: async (data) => {
    try {
      const { categoryId, ...productInfo } = data;
      const checkCategory = await model.Category.findByPk(categoryId);
      if (!checkCategory) {
        return {
          error: "Category not found",
        };
      }
      const [response, created] = await model.Product.findOrCreate({
        where: {
          name: data.name,
        },
        defaults: {
          category_id: categoryId,
          ...productInfo,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      return {
        data: created
          ? "Product created sucessfully"
          : "Failed to create product",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },

  update: async (data) => {
    try {
      const { categoryId, productId, ...productInfo } = data;
      const checkProduct = await model.Product.findByPk(productId);
      if (!checkProduct) {
        return {
          error: "Product not found",
        };
      }
      if (checkProduct.name == productInfo.name) {
        return {
          error: "Name of product has been already used",
        };
      }

      if (categoryId) {
        const checkCategory = await model.Category.findByPk(categoryId);
        if (!checkCategory) {
          return {
            error: "Category not found",
          };
        }
      }

      const response = await model.Product.update(
        {
          category_id: categoryId,
          ...productInfo,
          updated_at: new Date(),
        },
        {
          where: {
            id: productId,
          },
        }
      );
      return {
        data:
          response == 1
            ? "Product updated successfully"
            : "Failed to update product",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  destroy: async (data) => {
    try {
      const { productId } = data;
      const checkProduct = await model.Product.findByPk(productId);
      if (!checkProduct) {
        return {
          error: "Product not found or has been deleted",
        };
      }
      const response = await model.Product.destroy({
        where: {
          id: productId,
        },
      });
      return {
        data:
          response == 1
            ? "Product deleted successfully"
            : "Failed to delete product",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
};
