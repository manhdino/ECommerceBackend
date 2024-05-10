const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const { auth, admin } = require("../middleware/auth");

router.get("/", [auth], cartController.index);
router.get("/:productId", [auth], cartController.show);
router.get("create", [auth, admin], cartController.create);
router.put("/update/:productId", [auth, admin], cartController.update);
router.delete("/delete/:productId", [auth, admin], cartController.destroy);

module.exports = router;
