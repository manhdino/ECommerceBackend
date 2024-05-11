const UserRouter = require("./user.route");
const ProductRouter = require("./product.route");
const OrderRouter = require("./order.route");
const AuthRouter = require("./auth.route");
const CategoryRouter = require("./category.route");
const CartRouter = require("./cart.route");

const routes = (app) => {
  app.use("/api/auth", AuthRouter);
  app.use("/api/users", UserRouter);
  app.use("/api/products", ProductRouter);
  app.use("/api/orders", OrderRouter);
  app.use("/api/categories", CategoryRouter);
  app.use("/api/carts", CartRouter);
};

module.exports = routes;
