"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderDetails extends Model {
    static associate(models) {
      OrderDetails.belongsTo(models.Order, {
        targetKey: "id",
        foreignKey: "order_id",
        as: "order",
      });
      OrderDetails.belongsTo(models.Product, {
        targetKey: "id",
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  OrderDetails.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
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
      modelName: "OrderDetails",
      timestamps: false,
    }
  );
  return OrderDetails;
};
