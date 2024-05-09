"use strict";
const fs = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Products", [
      {
        category_id: 1,
        name: "Ultraboost - White/Black",
        seller: "Adidas",
        price: 420,
        stock: 20,
        ratings: 4,
        img: "https://bizweb.dktcdn.net/thumb/1024x1024/100/347/092/products/z-db3197-02.jpg",
        quantity: 1,
        description:
          "Inspired by the original low-profile tennis shoe, the Nike Killshot 2 updates the upper with a variety of textured leathers to create a fresh look. From soft suedes to smooth leathers with the perfect sheen, it's court-side attitude with a modern touch.",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
