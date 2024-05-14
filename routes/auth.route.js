// API Routes
const authController = require("../controllers/auth.controller");
const googleController = require("../controllers/google.controller")
const { auth } = require("../middleware/auth");
const router = require('express').Router();

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", auth, authController.signOut);

router.post("/refresh-token", authController.refreshToken );

// router.post("/forgot-password", authController.forgotPassword);

router.get('/google', googleController.redirectAuth);
router.get('/google/callback', googleController.googleCallback);

router.get('/verify-link', authController.verifyLink);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/me', auth, authController.getMe);

module.exports = router;
