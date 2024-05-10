const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { auth, admin } = require("../middleware/auth");

router.get("/", [auth], productController.index);
router.get("/:productId", [auth], productController.show);
router.get("create", [auth, admin], productController.create);
router.put("/update/:productId", [auth, admin], productController.update);
router.delete("/delete/:productId", [auth, admin], productController.destroy);

module.exports = router;
