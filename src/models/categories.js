"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    static associate(models) {
      Categories.hasMany(models.Products, {
        foreignKey: "cate_id",
        as: "products",
      });
    }
  }
  Categories.init(
    {
      name: {
        type: DataTypes.STRING(20),
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
      modelName: "Categories",
    }
  );
  return Categories;
};
