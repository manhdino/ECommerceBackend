const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { auth, admin } = require("../middleware/auth");

// router.get("/", productController.index);
// router.get("/:productId", productController.show);
// router.get("/:categoryId", productController.list);
// router.post("create", [auth, admin], productController.create);
// router.put("/update/:productId", [auth, admin], productController.update);
// router.delete("/delete/:productId", [auth, admin], productController.destroy);

router.get("/", productController.index);
router.get("/:productId", productController.show);
router.get("/list/:categoryId", productController.list);
router.post("/create", productController.create);
router.put("/update/:productId", productController.update);
router.delete("/delete/:productId", productController.destroy);
module.exports = router;
