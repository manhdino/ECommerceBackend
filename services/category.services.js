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
        error: error.errors[0].message,
      };
    }
  },
  create: async (data) => {
    try {
      const { name } = data;
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
        error: error.errors[0].message,
      };
    }
  },
  show: async (data) => {
    try {
      const { categoryId } = data;
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
        error: error.errors[0].message,
      };
    }
  },
  update: async (data) => {
    try {
      const { categoryId, name } = data;
      const checkCategory = await model.Category.findByPk(categoryId);
      if (!checkCategory) {
        return {
          error: "Category not found",
        };
      }
      const checkNameCategory = await model.Category.findOne({
        where: {
          name: name,
        },
      });
      if (checkNameCategory) {
        return {
          error: "Category has already been used",
        };
      }
      const response = await model.Category.update(
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
        error: error.errors[0].message,
      };
    }
  },
  destroy: async (data) => {
    try {
      const { categoryId } = data;
      const checkCategory = await model.Category.findByPk(categoryId);
      if (!checkCategory) {
        return {
          error: "Category not found or has been deleted",
        };
      }
      const response = await model.Category.destroy({
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
        error: error.errors[0].message,
      };
    }
  },
};
