const model = require("../database/models");

module.exports = {
  index: async () => {
    try {
      const response = await model.Order.findAll({
        attributes: { exclude: ["user_id"] },
        include: [
          {
            model: model.User,
            as: "ordered_by",
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
  show: async (orderId) => {
    try {
      const response = await model.Order.findByPk(orderId);
      if (!response) {
        return {
          error: "Order not found",
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

  update: async (orderId) => {
    try {
      const checkOrder = await model.Order.findByPk(orderId);
      if (!checkOrder) {
        return {
          error: "Order not found",
        };
      }
      //   const response = await db.Category.update();
      const response = 1;
      return {
        data:
          response == 1
            ? "Order updated successfully"
            : "Failed to update order",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  destroy: async (orderId) => {
    try {
      const checkOrder = await model.Order.findByPk(orderId);
      if (!checkOrder) {
        return {
          error: "Order not found or has been deleted",
        };
      }
      const response = await db.Order.destroy({
        where: {
          id: productId,
        },
      });
      return {
        data:
          response == 1
            ? "Order deleted successfully"
            : "Failed to delete order",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
};
