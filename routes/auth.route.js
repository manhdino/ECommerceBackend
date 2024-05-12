// API Routes
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authController = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth");
const passport = require('passport');
const { google_strategy } = require("../services/google.services");
const router = require('express').Router();

// router.use(passport.initialize());

passport.use(google_strategy);

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", auth, authController.signOut);
router.post("/refresh-token", authController.refreshToken );
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// router.get('/google/callback', authController.home)
router.get('/google/callback', 
  passport.authenticate('google', {
    session: false,
    successRedirect: '/api/home',
    failureRedirect: '/api/auth/sign-in'
   }),
);
router.get('/home', (req, res) => {
  res.send('home')
})
router.get('loi', (req, res) => {
  res.send('loi')
})
module.exports = router;
