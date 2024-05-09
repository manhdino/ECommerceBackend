"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      Cart.belongsTo(models.Product, {
        targetKey: "id",
        foreignKey: "product_id",
        as: "products",
      });
      Cart.belongsTo(models.User, {
        targetKey: "id",
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Cart.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Cart",
      timestamps: false,
    }
  );
  return Cart;
};
