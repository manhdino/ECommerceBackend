const model = require("../database/models");
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
  update: async (userId, data) => {
    try {
      const checkUser = await model.User.findByPk(userId);
      if (!checkUser) {
        return {
          error: "User not found",
        };
      }
      const response = await model.User.update(data, {where: {id: userId}});
      return {
        data: response == 1 ? "User deleted successfully" : "User deleted failed"
      }
      // const response = await model.Language.update();
      // const response = 1;
      // return {
      //   data:
      //     response == 1
      //       ? "Language updated successfully"
      //       : "Failed to update language",
      // };
    } catch (error) {
      return {
        error: error.message,
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
