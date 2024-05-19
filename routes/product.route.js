const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const { auth, admin } = require("../middleware/auth");
const uploadCloud = require("../middleware/uploader");

router.get("/", productController.index);
router.get("/:productId", productController.show);
router.get("/list/:categoryId", productController.list);
router.post(
  "/create",
  [auth, admin, uploadCloud.single("img")],
  productController.create
);
router.put(
  "/update/:productId",
  [auth, admin, uploadCloud.single("img")],
  productController.update
);
router.delete("/delete/:productId", productController.destroy);
module.exports = router;
