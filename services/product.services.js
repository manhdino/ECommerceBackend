const model = require("../database/models");

module.exports = {
  index: async () => {
    try {
      const response = await model.Product.findAll({});
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
  show: async (productId) => {
    try {
      const response = await model.Product.findByPk(productId);
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
      //   const response = await model.Product.create({});
      const response = 1;
      return response == 1
        ? "Product created sucessfully"
        : "Failed to create product";
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },

  update: async (productId) => {
    try {
      const checkProduct = await model.Product.findByPk(productId);
      if (!checkProduct) {
        return {
          error: "Product not found",
        };
      }
      //   const response = await db.Category.update();
      const response = 1;
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
  destroy: async (productId) => {
    try {
      const checkProduct = await model.Product.findByPk(productId);
      if (!checkProduct) {
        return {
          error: "Product not found or has been deleted",
        };
      }
      const response = await db.Product.destroy({
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
