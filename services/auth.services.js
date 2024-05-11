const model = require("../database/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      const { email, password } = data;
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
        email: email,
        password: password,
        username: email,
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
};
