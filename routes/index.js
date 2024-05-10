const UserRouter = require("./user.route");
const ProductRouter = require("./product.route");
const OrderRouter = require("./order.route");
const AuthRouter = require("./auth.route");

const routes = (app) => {
  app.use("/api/auth", AuthRouter);
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
};

module.exports = routes;
