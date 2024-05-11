const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {verifyToken, generateToken} = require('./auth.services')
const db = require('../database/models')
const User = db.User

const callbackStrategy = async (accessToken, refreshToken, profile, cb) => {
  try{
    const googleId = profile.id;
    const foudUser = await User.findOne({where: {googleId: googleId}});
    if (foudUser) {
      if (verifyToken(foudUser.refreshToken)){
        payload = {id: foudUser.id, role: foudUser.role};
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
      }
      else {
        const {accessToken, refreshToken} = generateToken(foudUser.id, foudUser.role);
        await User.update({
          refreshToken : refreshToken }, { where : {googleId: googleId} }
        )
      }
      return {
        success: true,
        accessToken: accessToken
      }
    }
    else {
      const familyName = profile.name.familyName;
      const givenName = profile.name.givenName;
      const avatar = profile.photos.value;
    }
  }
  catch(err) {

  }
}

module.exports = {
  callbackStrategy
}