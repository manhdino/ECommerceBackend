"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product_Images extends Model {
    static associate(models) {
      Product_Images.belongsTo(models.Products, {
        foreignKey: "product_id",
        targetKey: "id",
        as: "products",
      });
    }
  }
  Product_Images.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image_filename: {
        type: DataTypes.STRING,
      },
      url: {
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Product_Images",
    }
  );
  return Product_Images;
};
