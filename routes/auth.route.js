// API Routes
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authController = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth");
const passport = require('passport');
const router = require('express').Router();

// router.use(passport.initialize());
// router.use(passport.session());

// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/api/user/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     console.log(">>>access token:", accessToken);
//     console.log("refresh token", refreshToken);
//     console.log(profile);
//     cb(null,profile);
//   }
// ));
// //dang nhap voi google
// router.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile', 'email'] }));

// router.get('/auth/google/callback', 
//   passport.authenticate('google', { session: false, failureRedirect: '/accessDenied' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/api/user/getAllUser');
//   });
// router.get('/accessDenied', testAccessDenied);

// // route for logging out
// router.post('/logout', function(req, res, next) {
//   req.logout(function(err) {
//     if (err) { return next(err); }
//     res.redirect('/');
//   });
// });

// //


router.post("/sign-in", authController.signIn);
router.post("/sign-up", authController.signUp);
router.post("/sign-out", auth, authController.signOut);
router.post("refresh-token", authController.refreshToken );

module.exports = router;

module.exports = router;