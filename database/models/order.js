"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, {
        targetKey: "id",
        foreignKey: "ordered_by",
        as: "orderedBy",
      });

      Order.hasMany(models.OrderDetails, {
        onDelete: "CASCADE",
        foreignKey: "order_id",
        as: "orders",
      });
    }
  }
  Order.init(
    {
      ordered_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payment_method: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      amount: {
        type: DataTypes.DECIMAL(18, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
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
      modelName: "Order",
      timestamps: false,
    }
  );
  return Order;
};
