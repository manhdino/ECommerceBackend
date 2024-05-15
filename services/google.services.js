const jwt = require("jsonwebtoken");
// const {verifyToken, generateToken} = require('./auth.services')
const model = require("../database/models");

const { OAuth2Client } = require("google-auth-library");

const oAuth2client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

module.exports = {
  oAuth2client,
  getGoogleAuthUrl: async () => {
    const scopes = ["profile", "email"];
    const url = oAuth2client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
    });
    return url;
  },
  getUserInfo: async (accesToken) => {
    const userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";
    const response = await fetch(userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accesToken}`,
      },
    });
    const userInfo = await response.json();
    return userInfo;
  },

  findOrCreateUser: async (userInfo) => {
    try {
      const checkUser = await model.User.findOne({
        where: { email: userInfo.email },
      });
      if (checkUser && checkUser.google_id != null) {
        return { error: "Email is already registered." };
      }
      const googleId = userInfo.sub;

      const foundUser = await model.User.findOne({
        where: { google_id: googleId },
      });
      if (foundUser) {
        payload = { userId: foundUser.id, role: foundUser.role };
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });
        await model.User.update(
          { refresh_token: refreshToken },
          { where: { google_id: googleId } }
        );
        return {
          data: foundUser,
          refreshToken: refreshToken,
          accesToken: accessToken,
        };
      } else {
        const email = userInfo.email;
        const username = email;
        const pricture = userInfo.picture;
        const createdUser = await model.User.create({
          email: email,
          username: username,
          google_id: googleId,
          password: "/0",
          phone: "/0",
          pricture: pricture,
          created_at: new Date(),
          updated_at: new Date(),
        });
        payload = { userId: createdUser.id, role: createdUser.role };
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });
        createdUser.refresh_token = refreshToken;
        await createdUser.save();
        return {
          data: {
            user: createdUser,
            refreshToken: refreshToken,
            access_token: accessToken,
          },
        };
      }
    } catch (err) {
      return {
        error: err,
      };
    }
  },
};
