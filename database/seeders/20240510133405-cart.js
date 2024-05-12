"use strict";

const { quantity } = require("../../validations/product.validation");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let [users] = await queryInterface.sequelize.query(`SELECT id from Users;`);
    users = users.sort((a, b) => a.id - b.id);
    let [products] = await queryInterface.sequelize.query(
      `SELECT id,price from Products;`
    );
    await queryInterface.bulkInsert("Carts", [
      {
        product_id: products[0].id,
        user_id: users[0].id,
        quantity: 1,
        price: products[0].price,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[5].id,
        user_id: users[0].id,
        quantity: 5,
        price: products[5].price,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[0].id,
        user_id: users[1].id,
        quantity: 3,
        price: products[0].price,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[1].id,
        user_id: users[1].id,
        quantity: 4,
        price: products[1].price,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[8].id,
        user_id: users[2].id,
        quantity: 3,
        price: products[8].price,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[3].id,
        user_id: users[2].id,
        quantity: 2,
        price: products[3].price,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Carts", null, {});
  },
};
