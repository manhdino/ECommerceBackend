const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { auth, admin } = require("../middleware/auth");

router.get("/", categoryController.index);
router.post("/create", [auth, admin], categoryController.create);
router.put("/update/:categoryId", [auth, admin], categoryController.update);
router.delete("/delete/:categoryId", [auth, admin], categoryController.destroy);

module.exports = router;
