const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const {verifyToken, generateToken} = require('./auth.services')
const db = require('../database/models');
const { where } = require('sequelize');
const User = db.User

const callbackStrategy = async (refreshToken, accessToken, profile, done) => {
  try{
    const checkUser = await User.findOne({where: {email: profile.emails[0].value}});
    if (checkUser) {
      console.log('da dang ky')
      return done(null, false, {error: "This email is already registered."})
    }
    const googleId = profile.id;
    const foundUser = await User.findOne({where: {googleId: googleId}});
    if (foundUser) {
      // const checkVerify = verifyToken(foundUser.refreshToken);
      // if (checkVerify.userId){
        payload = {id: foundUser.id, role: foundUser.role};
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
        // const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
      // }
      // else {
        
        await User.update(
          {refreshToken : refreshToken }, { where : {googleId: googleId} }
        )
      // }
        done(null, foundUser);
    }
    else {
      const fullname = profile.name.familyName + ' ' + profile.name.givenName;
      const email = profile.emails[0].value;
      const username = email;
      const _user = await User.create({
        fullname: fullname,
        email: email,
        username: username,
        googleId: googleId,
        password: "/0",
        phone: "/0",
        address: "/0",
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),
      })
      payload = {id: _user.id, role: _user.role};
      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
      _user.refreshToken = refreshToken;
      await _user.save();
      const data =  {
        fullname: fullname,
        email: email,
        username: username,
        password: "/0",
        phone: "/0",
        address: "/0",
        role: "user",
        created_at: new Date(),
        updated_at: new Date(),    
      }
      done(null, data);
    }
  }
  catch(err) {
    return {
      error: err
    }
  }
}

const google_strategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/api/auth/google/callback"
}, callbackStrategy)


module.exports = {
  google_strategy,
  callbackStrategy,
}