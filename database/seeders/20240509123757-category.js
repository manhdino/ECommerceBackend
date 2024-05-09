"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Categories", [
      {
        name: "Adidas",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Nike",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Oxford",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Loafer",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Air Jordan",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Yezzy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Boot",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Categories", null, {});
  },
};
