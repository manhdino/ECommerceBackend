const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const googleController = require("../controllers/google.controller");
const { auth } = require("../middleware/auth");

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", auth, authController.signOut);
router.get("/verify-link", authController.verifyLink);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/google", googleController.redirectAuth);
router.post("/google/get-infor", googleController.getInforFromGoogle);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;

