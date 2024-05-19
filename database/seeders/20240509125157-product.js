"use strict";
const fs = require("fs");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      let [categories] = await queryInterface.sequelize.query(
        `SELECT id from Categories;`
      );
      categories = categories.sort((a, b) => a.id - b.id);
      const products = JSON.parse(fs.readFileSync("product.json", "utf8"));
      const productsWithCategoryIds = [];
      products.forEach((product, index) => {
        const categoryIdIndex = Math.floor(index / 10);
        const categoryId = categories[categoryIdIndex].id;
        productsWithCategoryIds.push({
          category_id: categoryId,
          name: product.name,
          seller: product.seller,
          price: product.price,
          stock: product.stock,
          ratings: product.ratings,
          img: product.img,
          description: product.description,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
      await queryInterface.bulkInsert("Products", productsWithCategoryIds);
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Products", null, {});
  },
};
