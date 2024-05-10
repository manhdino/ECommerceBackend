"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let [users] = await queryInterface.sequelize.query(`SELECT id from Users;`);
    users = users.sort((a, b) => a.id - b.id);
    let [products] = await queryInterface.sequelize.query(
      `SELECT id from Products;`
    );
    await queryInterface.bulkInsert("Carts", [
      {
        product_id: products[0].id,
        user_id: users[0].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[0].id,
        user_id: users[1].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[1].id,
        user_id: users[1].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[8].id,
        user_id: users[2].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_id: products[3].id,
        user_id: users[2].id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Carts", null, {});
  },
};
