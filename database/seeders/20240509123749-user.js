"use strict";
const bcrypt = require("bcryptjs");
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "dinomanh",
        fullname: "Nguyễn Đình Mạnh",
        email: "dinomanh123@gmail.com",
        role: "user",
        phone: "0866020143",
        password: await bcrypt.hash("12345678", 10),
        address: "134 Trương Định,Hai Bà Trưng, Hà Nội",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "johndoe",
        fullname: "John Doe",
        email: "johndoe@gmail.com",
        role: "user",
        phone: "0866020143",
        password: await bcrypt.hash("12345678", 10),
        address: "134 Trương Định,Hai Bà Trưng, Hà Nội",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "hoangnam",
        fullname: "Nguyễn Hoàng Nam",
        email: "hoangnam123@gmail.com",
        role: "user",
        phone: "0866020143",
        password: await bcrypt.hash("12345678", 10),
        address: "134 Trương Định,Hai Bà Trưng, Hà Nội",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        username: "admin",
        fullname: "Vũ Trọng Nam",
        email: "admin123@gmail.com",
        role: "admin",
        phone: "0975692143",
        password: await bcrypt.hash("12345678", 10),
        address: "114 Phố P. Trần Đại Nghĩa, Đồng Tâm, Hai Bà Trưng, Hà Nội",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
