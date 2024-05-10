"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let [orders] = await queryInterface.sequelize.query(
      `SELECT id from Orders;`
    );
    orders = orders.sort((a, b) => a.id - b.id);
    let [products] = await queryInterface.sequelize.query(
      `SELECT id,price from Products;`
    );
    await queryInterface.bulkInsert("OrderDetails", [
      {
        order_id: orders[0].id,
        product_id: products[0].id,
        price: products[0].price,
        quantity: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: orders[0].id,
        product_id: products[1].id,
        price: products[1].price,
        quantity: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: orders[1].id,
        product_id: products[2].id,
        price: products[2].price,
        quantity: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        order_id: orders[2].id,
        product_id: products[8].id,
        price: products[8].price,
        quantity: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        order_id: orders[1].id,
        product_id: products[12].id,
        price: products[12].price,
        quantity: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("OrderDetails", null, {});
  },
};
