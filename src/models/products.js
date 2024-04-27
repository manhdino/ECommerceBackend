"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Products extends Model {
    static associate(models) {
      Products.belongsTo(models.Categories, {
        foreignKey: "cate_id",
        targetKey: "id",
        as: "categories",
      });
      Products.hasMany(models.Product_Images, {
        foreignKey: "product_id",
        as: "product_images",
      });
    }
  }
  Products.init(
    {
      cate_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(100),
      },
      description: {
        type: DataTypes.TEXT,
      },
      original_price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      sale_price: {
        type: DataTypes.DECIMAL(10, 2),
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      vat: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      warrenty: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      modelName: "Products",
    }
  );
  return Products;
};
