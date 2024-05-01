"use strict";

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert("Categories", [
      {
        name: "Laptop",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Phone",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Earphone",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Screen",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Playstation",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Refrigerator",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Television",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete("Categories", null, {});
  },
};
