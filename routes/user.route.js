const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth, admin } = require("../middleware/auth");

router.get("/", [auth, admin], userController.index);
router.get("/:userId", [auth], userController.show);
router.put("/update/:userId", [auth], userController.update);
router.post("/update-password/:userId", auth, userController.updatePassword);
router.delete("/delete/:userId", [auth, admin], userController.destroy);
module.exports = router;

