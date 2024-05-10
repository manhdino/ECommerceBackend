const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { auth, admin } = require("../middleware/auth");

router.get("/get-all", [auth, admin], userController.index);
router.get("/get-details", [auth], userController.show);
router.put("/update/:userId", [auth, admin], userController.update);
router.delete("/delete/:userId", [auth, admin], userController.destroy);

module.exports = router;
