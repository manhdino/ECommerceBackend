const UserRouter = require("./user.route");
const ProductRouter = require("./product.route");
const OrderRouter = require("./order.route");
const AuthRouter = require("./auth.route");
const CategoryRouter = require("./category.route");

const routes = (app) => {
  app.use("/api/auth", AuthRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/category", CategoryRouter);
};

module.exports = routes;
