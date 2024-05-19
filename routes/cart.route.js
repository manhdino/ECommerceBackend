const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { auth } = require("../middleware/auth");

router.get("/", auth, cartController.index);
router.post("/add/:productId", auth, cartController.create);
router.delete("/delete/:productId", auth, cartController.destroy);
module.exports = router;
