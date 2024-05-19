"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Order, {
        onDelete: "CASCADE",
        foreignKey: "user_id",
        as: "orders",
      });
      User.hasMany(models.Cart, {
        onDelete: "CASCADE",
        foreignKey: "user_id",
        as: "cart",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING(30),
      },
      fullname: {
        type: DataTypes.STRING(50),
      },
      email: {
        type: DataTypes.STRING(30),
        unique: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(10),
        defaultValue: "user",
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING(20),
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password_code: {
        type: DataTypes.STRING,
      },
      picture: {
        type: DataTypes.STRING,
        defaultValue: "https://i.ibb.co/tBDhxh6/avatar.png",
      },
      address: {
        type: DataTypes.TEXT,
      },
      refresh_token: {
        type: DataTypes.STRING,
      },
      google_id: {
        type: DataTypes.STRING,
        defaultValue: null,
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
      modelName: "User",
      timestamps: false,
    }
  );
  User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  });
  return User;
};