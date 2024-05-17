const jwt = require("jsonwebtoken");
const model = require("../database/models");
const { OAuth2Client } = require("google-auth-library");
const fetch = require("node-fetch");

const oAuth2client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "https://ecommercebackend-953d.up.railway.app/api/auth/google/callback"
);

const scopes = [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email",
];

module.exports = {
  oAuth2client,

  getGoogleAuthUrl: async () => {
    const url = oAuth2client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
    });
    return url;
  },

  getUserInfo: async (accessToken) => {
    const userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";
    try {
      const response = await fetch(userInfoEndpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error fetching user info: ${response.statusText}`);
      }

      const userInfo = await response.json();
      return userInfo;
    } catch (error) {
      throw error;
    }
  },

  findOrCreateUser: async (userInfo) => {
    try {
      const { sub, email, picture } = userInfo;
      const googleId = sub;

      const checkUser = await model.User.findOne({
        where: { email: userInfo.email },
      });
      if (checkUser && checkUser.google_id == googleId) {
        const payload = { userId: checkUser.id, role: checkUser.role };
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });
        await model.User.update(
          { refresh_token: refreshToken },
          { where: { google_id: checkUser.google_id } }
        );
        return {
          data: {
            user: checkUser,
            refreshToken: refreshToken,
            accessToken: accessToken,
          },
        };
      }

      if (!checkUser) {
        const createdUser = await model.User.create({
          email: email,
          username: email,
          google_id: googleId,
          picture: picture,
          password: "/0",
          phone: "/0",
          picture: picture,
          created_at: new Date(),
          updated_at: new Date(),
        });

        payload = { userId: createdUser.id, role: createdUser.role };
        refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });
        accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });

        createdUser.refresh_token = refreshToken;
        await createdUser.save();
        return {
          data: {
            user: createdUser,
            refreshToken: refreshToken,
            accessToken: accessToken,
          },
        };
      } else {
        const payload = { userId: checkUser.id, role: checkUser.role };
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "7d",
        });
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
          expiresIn: "1d",
        });
        await model.User.update(
          { refresh_token: refreshToken, google_id: googleId },
          { where: { id: checkUser.id } }
        );
        return {
          data: {
            user: checkUser,
            refreshToken: refreshToken,
            accessToken: accessToken,
          },
        };
      }
    } catch (err) {
      return {
        error: err.message,
      };
    }
  },
};
