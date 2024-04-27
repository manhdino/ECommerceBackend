const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("ecommerce", "root", "10062001", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

const connection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = connection;
