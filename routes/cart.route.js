const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { auth } = require("../middleware/auth");

router.get("/", auth, cartController.index);
router.get("add", auth, cartController.create);
router.put("/update/:productId", auth, cartController.update);
router.delete("/delete/:productId", auth, cartController.destroy);

module.exports = router;
