const model = require("../database/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { emailContent, sendMail } = require("./mail.services");
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
      const isPasswordValid = await bcrypt.compare(
        password,
        checkUser.password
      );

      if (!isPasswordValid) {
        return {
          error: "Invalid password",
        };
      }

      const access_token = jwt.sign(
        { userId: checkUser.id, role: checkUser.role },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "5h",
        }
      );

      return {
        data: {
          user: {
            id: checkUser.id,
            username: checkUser.username,
            email: checkUser.email,
            fullname: checkUser.fullname,
            role: checkUser.role,
            phone: checkUser.phone,
            address: checkUser.address,
            created_at: checkUser.created_at,
            updated_at: checkUser.updated_at,
          },
          access_token: access_token,
        },
      };
    } catch (error) {
      return {
        data: error.message,
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
      return {
        data: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullname: newUser.fullname,
          role: newUser.role,
          phone: newUser.phone,
          address: newUser.address,
          created_at: newUser.created_at,
          updated_at: newUser.updated_at,
        },
      };
    } catch (error) {
      return {
        data: error.message,
      };
    }
  },

  resetPassword: async (token, newPassword) => {
    const payload = await verifyToken(token);
    if (payload.error) {
      return {
        error: "reset password code is expired",
      };
    }
    try {
      const user = await User.findOne({
        where: {
          id: payload.userId,
        },
      });
      if (!user) {
        return {
          error: "Email not found",
        };
      }
      if (payload.code != user.passwordCode) {
        return {
          error: "Unauthorized!",
        };
      }
      user.password = newPassword;
      user.passwordCode = null;
      await user.save();
      return {
        data: "password updated",
      };
    } catch (err) {
      return {
        error: "invalid",
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
      const passwordCode = Math.floor(Math.random() * 1000000) + 1000000;
      checkUser.password_code = passwordCode;
      await checkUser.save();
      const token = jwt.sign(
        { userId: checkUser.id, passwordCode: passwordCode },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "5m" }
      );
      const resetLink = `${protocol}://${host}/api/auth/verify-link?token=${token}&email=${email}`;
      console.log(resetLink);
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
    } catch (err) {
      return {
        error: err,
      };
    }
  },

  verifyLink: async (email, token) => {
    try {
      let decoded = verifyToken(token);
      if (decoded.error) {
        return {
          error: "Invalid Link",
        };
      }
      const user = await User.findOne({
        where: {
          id: decoded.userId,
        },
      });
      if (user.passwordCode != decoded.code) {
        return {
          error: "invalid Link",
        };
      }
      return {
        data: "Valid Link",
      };
    } catch (err) {
      return {
        error: err,
      };
    }
  },
};
