const { sequelize } = require("../database/models");
const model = require("../database/models");

module.exports = {
  index: async (data) => {
    try {
      const { userId, role } = data;
      let response = null;
      if (role == "admin") {
        response = await model.Order.findAll({
          attributes: { exclude: ["user_id"] },
          include: [
            {
              model: model.User,
              as: "ordered_by",
              attributes: { exclude: ["created_at", "updated_at", "password"] },
            },
          ],
        });
      }
      if (role == "user") {
        response = await model.Order.findAll({
          where: {
            user_id: userId,
          },
          attributes: { exclude: ["user_id"] },
          include: [
            {
              model: model.User,
              as: "ordered_by",
              attributes: { exclude: ["created_at", "updated_at", "password"] },
            },
          ],
        });
      }

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
        error: error.errors[0].message,
      };
    }
  },
  show: async (data) => {
    try {
      const { orderId, userId, role } = data;

      const checkOrder = await model.Order.findByPk(orderId);
      if (role == "user" && checkOrder.user_id != userId) {
        return {
          error: "Unauthorized",
        };
      }

      if (!checkOrder) {
        return {
          error: "Order not found",
        };
      }
      const response = await model.OrderDetails.findAll({
        where: {
          order_id: orderId,
        },
        attributes: { exclude: ["order_id"] },
        include: [
          {
            model: model.Product,
            as: "product",
            attributes: {
              exclude: ["created_at", "updated_at", "id"],
            },
          },
        ],
      });
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
        error: error.errors[0].message,
      };
    }
  },
  create: async (data) => {
    try {
      const { paymentMethod, amount, ...userInfo } = data;

      const result = await sequelize.transaction(async (t) => {
        const createdOrder = await model.Order.create(
          {
            user_id: userInfo.userId,
            payment_method: paymentMethod,
            amount: amount,
            status: "created",
            created_at: new Date(),
            updated_at: new Date(),
          },
          { transaction: t }
        );

        if (createdOrder) {
          const products = await model.Cart.findAll(
            {
              where: {
                user_id: userInfo.userId,
              },
            },
            { transaction: t }
          );

          if (products) {
            const orderDetailsPromises = products.map(async (product) => {
              await model.OrderDetails.create(
                {
                  product_id: product.product_id,
                  order_id: createdOrder.id,
                  price: product.price,
                  quantity: product.quantity,
                  created_at: new Date(),
                  updated_at: new Date(),
                },
                { transaction: t }
              );
            });

            await Promise.all(orderDetailsPromises);
          }
        }

        return createdOrder;
      });

      if (result) {
        return {
          data: result,
        };
      } else {
        return {
          error: "Failed to create new order",
        };
      }
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },
  update: async (data) => {
    try {
      const { orderId, status } = data;
      const checkOrder = await model.Order.findByPk(orderId);
      if (!checkOrder) {
        return {
          error: "Order not found",
        };
      }
      const response = await model.Order.update(
        {
          status: status,
        },
        {
          where: {
            id: orderId,
          },
        }
      );

      return {
        data:
          response == 1
            ? "Order updated successfully"
            : "Failed to update order",
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },
  destroy: async (data) => {
    try {
      const { orderId, ...userInfo } = data;
      const checkOrder = await model.Order.findByPk(orderId);
      if (!checkOrder) {
        return {
          error: "Order not found or has been deleted",
        };
      }
      let response = null;
      if (userInfo.role == "admin") {
        response = await model.Order.destroy({
          where: {
            id: orderId,
          },
        });
      } else {
        response = await model.Order.destroy({
          where: {
            id: orderId,
            user_id: userInfo.userId,
          },
        });
      }

      return {
        data:
          response == 1
            ? "Order deleted successfully"
            : "Failed to delete order",
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },
};
