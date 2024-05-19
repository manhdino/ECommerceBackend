"use strict";
/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        type: Sequelize.STRING(30),
      },
      fullname: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(30),
        unique: true,
        allowNull: false,
      },
      avatar: {
        type: Sequelize.TEXT,
      },
      role: {
        type: Sequelize.STRING(10),
        defaultValue: "user",
        allowNull: false,
      },
      picture: {
        type: Sequelize.STRING,
        defaultValue: "https://i.ibb.co/tBDhxh6/avatar.png",
      },
      phone: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password_code: {
        type: Sequelize.STRING,
      },
      google_id: {
        type: Sequelize.STRING,
        defaultValue: null,
      },
      refresh_token: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      googleId: {
        type: Sequelize.STRING
      },
      refreshToken: {
        type: Sequelize.STRING
      },
      passwordCode: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};