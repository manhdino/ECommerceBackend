const model = require("../database/models");

module.exports = {
  index: async () => {
    try {
      const response = await model.Category.findAll({});
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
  create: async (name) => {
    try {
      const checkCategory = await model.Category.findOne({
        where: {
          name: name,
        },
      });
      if (checkCategory) {
        return {
          error: "Category name has been used",
        };
      }
      const response = await model.Category.create({
        name: name,
        created_at: new Date(),
        updated_at: new Date(),
      });
      if (response) {
        return {
          data: "Category created sucessfully",
        };
      } else {
        return {
          error: "Failed to create category",
        };
      }
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  show: async (categoryId) => {
    try {
      const response = await model.Category.findByPk(categoryId);
      if (!response) {
        return {
          error: "Category not found",
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
  update: async (categoryId, name) => {
    try {
      const checkCategory = await model.Category.findByPk(categoryId);
      if (!checkCategory) {
        return {
          error: "Category not found",
        };
      }
      const response = await db.Category.update(
        {
          name: name,
          updated_at: new Date(),
        },
        {
          where: {
            id: categoryId,
          },
        }
      );
      return {
        data:
          response == 1
            ? "Category updated successfully"
            : "Category updated failed",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
  destroy: async (categoryId) => {
    try {
      const checkCategory = await model.Category.findByPk(categoryId);
      if (!checkCategory) {
        return {
          error: "Category not found or has been deleted",
        };
      }
      const response = await db.Category.destroy({
        where: {
          id: categoryId,
        },
      });
      return {
        data:
          response == 1
            ? "Category deleted successfully"
            : "Category deleted failed",
      };
    } catch (error) {
      return {
        error: error.message,
      };
    }
  },
};
