const model = require("models");

module.exports = {
  index: async () => {
    try {
      const response = await model.Cart.findAll({});
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
  create: async (data) => {
    try {
      //   const response = await db.Cart.create({
      //   });
      const response = 1;
      if (response) {
        return {
          data: "Add product to cart sucessfully",
        };
      } else {
        return {
          error: "Failed to add product to cart",
        };
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  update: async (productId) => {
    try {
      //   const response = await model.Category.update();
      const response = 1;
      return {
        data:
          response == 1
            ? "Cart updated successfully"
            : "Fail to update product in cart",
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
          error: "Product not found in cart or has been deleted",
        };
      }
      const response = await model.Cart.destroy({
        where: {
          product_id: productId,
        },
      });
      return {
        data:
          response == 1
            ? "Cart updated successfully"
            : "Failed to delete product from cart",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
};
