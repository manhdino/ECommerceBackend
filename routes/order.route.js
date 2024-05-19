const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { auth, admin } = require("../middleware/auth");

router.get("/", [auth], orderController.index);
router.get("/:orderId", [auth], orderController.show);
router.post("/create", [auth], orderController.create);
router.put("/update/:orderId", [auth, admin], orderController.update);
router.delete("/delete/:orderId", [auth], orderController.destroy);
module.exports = router;
