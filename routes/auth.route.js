const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth");

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", auth, authController.signOut);

module.exports = router;
