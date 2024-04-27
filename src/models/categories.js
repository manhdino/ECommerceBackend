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
      name: DataTypes.STRING,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Categories",
    }
  );
  return Categories;
};
