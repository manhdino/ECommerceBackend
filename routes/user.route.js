const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth, admin } = require("../middleware/auth");

// router.get("/", [auth, admin], userController.index);
// router.get("/:userId", [auth], userController.show);
// router.put("/update/:userId", [auth, admin], userController.update);
// router.delete("/delete/:userId", [auth, admin], userController.destroy);

router.get("/", userController.index);
router.get("/:userId", userController.show);
router.put("/update/:userId", userController.update);
router.delete("/delete/:userId", userController.destroy);
module.exports = router;
