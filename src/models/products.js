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
    }
  }
  Products.init(
    {
      cate_id: DataTypes.INTEGER,
      name: DataTypes.STRING(100),
      description: DataTypes.TEXT,
      original_price: DataTypes.DECIMAL(10, 2),
      sale_price: DataTypes.DECIMAL(10, 2),
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
      modelName: "Products",
    }
  );
  return Products;
};
