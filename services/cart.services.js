const model = require("../database/models");

module.exports = {
  index: async (data) => {
    try {
      const { userId, role } = data;
      const checkUser = await model.User.findByPk(userId);
      if (!checkUser) {
        return {
          error: "User not found",
        };
      }
      let response = null;
      if (role == "user") {
        response = await model.Cart.findAll({
          where: {
            user_id: userId,
          },
          attributes: {
            exclude: ["product_id", "created_at", "updated_at"],
          },
          include: [
            {
              model: model.Product,
              as: "product",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
            },
          ],
        });
      }
      if (role == "admin") {
        response = await model.Cart.findAll({
          attributes: {
            exclude: ["created_at", "updated_at"],
          },
          include: [
            {
              model: model.Product,
              as: "product",
              attributes: {
                exclude: ["created_at", "updated_at"],
              },
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
  create: async (data) => {
    try {
      const { productId, quantity, ...userInfo } = data;
      const checkProduct = await model.Product.findByPk(productId);
      if (!checkProduct) {
        return {
          error: "Product not found",
        };
      }

      console.log(productId, quantity, userInfo);

      const checkCart = await model.Cart.findOne({
        where: {
          product_id: productId,
          user_id: userInfo.userId,
        },
      });

      if (checkCart) {
        checkCart.quantity = quantity;
        checkCart.updated_at = new Date();
        await checkCart.save();
        return {
          data: "Add product to cart successfully",
        };
      }
      const createdCart = await model.Cart.create({
        product_id: productId,
        user_id: userInfo.userId,
        price: checkProduct.price,
        quantity: quantity,
        created_at: new Date(),
        updated_at: new Date(),
      });

      if (createdCart) {
        return {
          data: "Add product to cart successfully",
        };
      }
      return {
        error: "Failed to add product to cart",
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },
  destroy: async (data) => {
    try {
      const { productId, ...userInfo } = data;
      const checkProduct = await model.Product.findByPk(productId);
      if (!checkProduct) {
        return {
          error: "Product not found in cart or has been deleted",
        };
      }
      let response = null;
      if (userInfo.role == "user") {
        response = await model.Cart.destroy({
          where: {
            product_id: productId,
            user_id: userInfo.userId,
          },
        });
      }
      if (userInfo.role == "admin") {
        response = await model.Cart.destroy({
          where: {
            product_id: productId,
          },
        });
      }
      return {
        data:
          response == 1
            ? "Cart updated successfully"
            : "Failed to delete product from cart",
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },
};
