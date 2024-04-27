"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cate_id: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: "categories",
          key: "id",
        },
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(100),
      },
      description: {
        type: Sequelize.TEXT,
      },
      original_price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      sale_price: {
        type: Sequelize.DECIMAL(10, 2),
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      sold: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      vat: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      warrenty: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable("Products");
  },
};
