const jwt = require('jsonwebtoken')
// const {verifyToken, generateToken} = require('./auth.services')
const db = require('../database/models');
const { where } = require('sequelize');
const User = db.User

const { OAuth2Client } = require('google-auth-library');

const oAuth2client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, process.env.REDIRECT_URI);
const getGoogleAuthUrl = async () => {
  const scopes = ['profile', 'email'];
  const url = oAuth2client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent'
  });
  return url;
}

const getUserInfor = async (accesToken) => {
  const userInfoEndpoint = 'https://www.googleapis.com/oauth2/v3/userinfo';
  const response = await fetch(userInfoEndpoint, {
    headers: {
      'Authorization': `Bearer ${accesToken}`
    }
  });
  const userInfor = await response.json();
  return userInfor;
}

const findOrCreateUser = async (userInfor) => {
  try {
      const checkUser = await User.findOne({where: {email: userInfor.email}});
      if (checkUser) {
        console.log('da dang ky')
        return {error: "This email is already registered."}
      }
      const googleId = userInfor.sub;
      const foundUser = await User.findOne({where: {googleId: googleId}});
      if (foundUser) {
          payload = {userId: foundUser.id, role: foundUser.role};
          const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
          const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
          await User.update(
            {refreshToken : refreshToken }, { where : {googleId: googleId} }
          )
          return {
            data: foundUser,
            refreshToken: refreshToken,
            accesToken: accessToken
          }
      }
      else {
        const fullname = userInfor.name;
        const email = userInfor.email;
        const username = email;
        const avatar = userInfor.picture;
        const _user = await User.create({
          fullname: fullname,
          email: email,
          username: username,
          googleId: googleId,
          password: "/0",
          phone: "/0",
          avatar: avatar,
          address: "/0",
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),
        })
        console.log(_user.id)
        payload = {userId: _user.id, role: _user.role};
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: "7d"});
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
        _user.refreshToken = refreshToken;
        await _user.save();
        // console.log('hello')
        const data =  {
          fullname: fullname,
          email: email,
          username: username,
          avatar: avatar,
          password: "/0",
          phone: "/0",
          address: "/0",
          role: "user",
          created_at: new Date(),
          updated_at: new Date(),    
        }
        return {
          data: {
            user: data,
            refreshToken: refreshToken,
            access_token: accessToken
          }
        }
      }
  }
  catch(err) {
    return {
      error: err
    }
  }
}

module.exports = {
  getGoogleAuthUrl,
  getUserInfor,
  findOrCreateUser,
  oAuth2client
}