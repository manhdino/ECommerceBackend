const model = require("../database/models");
const error = require("../helpers/error");
const bcrypt = require("bcryptjs");
module.exports = {
  index: async () => {
    try {
      const response = await model.User.findAll({
        attributes: { exclude: ["password"] }},
        {where: {role: "user"}}
      );
      if (response) {
        return {
          data: response,
        };
      }
      return {
        error: "Cannot find resouces",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  show: async (userId) => {
    try {
      const response = await model.User.findByPk(userId, {
        attributes: {
           exclude: ['password']
        }});
      if (!response) {
        return {
          error: "User not found",
        };
      }
      return {
        data: response,
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  update: async (data, userId) => {

    try {
      const { username, fullname, email, address, phone } = data;
      const checkUser = await model.User.findByPk(userId);
      if (!checkUser) {
        return {
          error: "User not found",
        };
      }
      if (checkUser.email != email) {
        const checkEmail = await model.User.findOne({
          where: {
            email: email,
          },
        });
        if (checkEmail) {
          return {
            error: "Email already in used",
          };
        }
      }

      const response = await model.User.update(
        {
          username: username,
          fullname: fullname,
          email: email,
          phone: phone,
          address: address,
        },
        {
          where: {
            id: userId,
          },
        }
      );

      return {
        data:
          response == 1 ? "User updated successfully" : "Failed to update user",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  updatePassword: async (data, userId) => {
    try {
      const checkUser = await model.User.findByPk(userId);
      if (!checkUser) {
        return {
          error: "User not found",
        };
      }
      else if (checkUser.google_id) {
        return {
          error: "Email is registered as a Google account"
        }
      }
      const { oldPassword, password } = data;

      const isPasswordValid = await bcrypt.compare(
        oldPassword,
        checkUser.password
      );

      if (!isPasswordValid) {
        return {
          error: "Invalid password",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      checkUser.password = hashedPassword;
      checkUser.save();
      return {
        data: "Password updated successfully",
      };
    } catch (error) {
      return {
        data: error.message,
      };
    }
  },
  destroy: async (userId) => {
    try {
      const checkUser = await model.User.findByPk(userId);
      if (!checkUser) {
        return {
          error: "User not found or has been deleted",
        };
      }
      const response = await model.User.destroy({
        where: {
          id: checkUser.id,
        },
      });
      return {
        data:
          response == 1 ? "User deleted successfully" : "User deleted failed",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
};
