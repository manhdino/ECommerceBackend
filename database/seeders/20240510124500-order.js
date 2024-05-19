"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    let [users] = await queryInterface.sequelize.query(`SELECT id from Users;`);
    users = users.sort((a, b) => a.id - b.id);
    await queryInterface.bulkInsert("Orders", [
      {
        user_id: users[0].id,
        payment_method: "cod",
        amount: 1345.34,
        status: "created",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: users[1].id,
        payment_method: "banking",
        amount: 200.67,
        status: "processing",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: users[2].id,
        payment_method: "cod",
        amount: 1200,
        status: "shipping",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Orders", null, {});
  },
};
