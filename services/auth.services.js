const model = require("../database/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { emailContent, sendMail } = require("./mail.services");
const rs = require("../helpers/error");
const generateToken = async (userId, role, time) => {
  try {
    const payload = { userId: userId, role: role };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: time,
    });
    return {
      token,
    };
  } catch (err) {
    return {
      error: err,
    };
  }
};
module.exports = {
  signIn: async (data) => {
    try {
      const { email, password } = data;
      const checkUser = await model.User.findOne({
        where: {
          email: email,
        },
      });
      if (!checkUser) {
        return {
          error: "Email not found",
        };
      }
      if (checkUser.google_id) {
        return {
          error: "This email is registered as a Google account"
        }
      }
      else {
        const isPasswordValid = await bcrypt.compare(
          password,
          checkUser.password
        );

        if (!isPasswordValid) {
          return {
            error: "Invalid password",
          };
        }
      }
      const accessToken = await generateToken(
        checkUser.id,
        checkUser.role,
        "1h"
      );
      const refreshToken = await generateToken(
        checkUser.id,
        checkUser.role,
        "7h"
      );

      await model.User.update(
        {
          refresh_token: refreshToken.token,
        },
        {
          where: {
            id: checkUser.id,
          },
        }
      );

      const user = await model.User.findOne({
        where: {
          id: checkUser.id,
        },
        attributes: { exclude: ["password", "refresh_token", "password_code", "google_id"] },
      });
      return {
        data: user,
        access_token: accessToken.token,
        refresh_token: refreshToken.token,
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },
  signUp: async (data) => {
    try {
      const { email, password, username } = data;
      const checkUser = await model.User.findOne({
        where: {
          email: email,
        },
      });
      if (checkUser) {
        return {
          error: "Email is already in used",
        };
      }
      const newUser = await model.User.create({
        username: username,
        email: email,
        password: password,
        created_at: new Date(),
        updated_at: new Date(),
      });
      const accessToken = await generateToken(newUser.id, newUser.role, "1h");
      const refreshToken = await generateToken(newUser.id, newUser.role, "7h");
      newUser.refresh_token = refreshToken.token;
      await newUser.save();

      const user = await model.User.findOne({
        where: {
          id: newUser.id,
        },
        attributes: { exclude: ["password", "refresh_token", "password_code", "google_id"] },
      });
      return {
        data: user,
        access_token: accessToken.token,
        refresh_token: refreshToken.token,
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },

  resetPassword: async (token, data) => {
    try {
      const { password } = data;
      let userInfo = null;
      jwt.verify(token, process.env.JWT_SECRET_KEY, (error, res) => {
        if (error) {
          return rs.unauthorized(res, "Unauthorized");
        }
        if (res) {
          userInfo = res;
        } else {
          return rs.unauthorized(res, "Unauthorized");
        }
      });
      const checkUser = await model.User.findOne({
        where: {
          id: userInfo.userId,
        },
      });
      if (userInfo.passwordCode != checkUser.password_code) {
        return rs.unauthorized(res, "Unauthorized");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      checkUser.password = hashedPassword;
      await checkUser.save();
      return {
        data: "Password reset successfully",
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },

  forgotPassword: async (email, host, protocol) => {
    try {
      const checkUser = await model.User.findOne({
        where: { email: email },
      });
      if (!checkUser) {
        return {
          error: "Email not found",
        };
      }
      if (checkUser.google_id) {
        return {
          error: "This email is registered as a Google account"
        }
      }
      const passwordCode = Math.floor(Math.random() * 1000000) + 1000000;
      checkUser.password_code = passwordCode;
      await checkUser.save();
      const token = jwt.sign(
        { userId: checkUser.id, passwordCode: passwordCode },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "5m" }
      );
      const resetLink = `${protocol}://${host}/api/auth/verify-link?token=${token}`;
      const html = emailContent(checkUser.username, resetLink);
      const response = await sendMail(email, html);
      if (response.error) {
        return {
          error: response.error,
        };
      }
      return {
        data: response.info,
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },

  verifyLink: async (token) => {
    try {
      let userInfo = null;
      jwt.verify(token, process.env.JWT_SECRET_KEY, (error, res) => {
        if (error) {
          return rs.unauthorized(res, "Unauthorized");
        }
        if (res.userId) {
          userInfo = res;
        } else {
          return rs.unauthorized(res, "Unauthorized");
        }
      });

      if (!userInfo) {
        return {
          error: "Unauthorized!",
        };
      }
      const checkUser = await model.User.findOne({
        where: {
          id: userInfo.userId,
        },
      });
      if (checkUser.password_code != userInfo.passwordCode) {
        return {
          error: "Unauthorized!",
        };
      }

      return {
        data: token,
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      let userInfo = null;
      jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (error, user) => {
        if (error) {
          return rs.unauthorized(res, "Refresh token is expired");
        }
        if (user.userId) {
          userInfo = user;
        } else {
          return rs.unauthorized(res, "Unauthorized");
        }
      });
      const checkUser = await model.User.findOne({
        where: {
          id: userInfo.userId,
        },
      });
      if (checkUser) {
        return {
          data: {
            access_token: (
              await generateToken(checkUser.id, checkUser.role, "1h")
            ).token,
            refresh_token: (
              await generateToken(checkUser.id, checkUser.role, "7d")
            ).token,
          },
        };
      }
      return {
        error: "User not found",

      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },

};