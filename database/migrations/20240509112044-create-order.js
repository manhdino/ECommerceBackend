"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Users",
          },
          key: "id",
        },
        allowNull: false,
        onDelete: "CASCADE",
      },
      payment_method: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(18, 2),
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
  },
};
