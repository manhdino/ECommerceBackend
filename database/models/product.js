"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Category, {
        targetKey: "id",
        foreignKey: "category_id",
        as: "category",
      });
      Product.hasMany(models.Cart, {
        onDelete: "CASCADE",
        foreignKey: "product_id",
        as: "products",
      });
      Product.hasMany(models.OrderDetails, {
        onDelete: "CASCADE",
        foreignKey: "product_id",
        as: "orders",
      });
    }
  }
  Product.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      seller: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      ratings: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      img: {
        type: DataTypes.TEXT,
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
      modelName: "Product",
      timestamps: false,
    }
  );
  return Product;
};
