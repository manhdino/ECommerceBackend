const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const { auth, admin } = require("../middleware/auth");

// router.get("/", [auth], categoryController.index);
// router.get("/:categoryId", [auth], categoryController.show);
// router.get("/create", [auth, admin], categoryController.create);
// router.put("/update/:categoryId", [auth, admin], categoryController.update);
// router.delete("/delete/:categoryId", [auth, admin], categoryController.destroy);

router.get("/", categoryController.index);
router.get("/:categoryId", categoryController.show);
router.post("/create", categoryController.create);
router.put("/update/:categoryId", categoryController.update);
router.delete("/delete/:categoryId", categoryController.destroy);
module.exports = router;
