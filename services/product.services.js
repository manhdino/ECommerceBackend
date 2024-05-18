const model = require("../database/models");
const cloudinary = require("cloudinary").v2;
module.exports = {
  index: async () => {
    try {
      const response = await model.Product.findAll({
        attributes: { exclude: ["category_id", "created_at", "updated_at"] },
        include: [
          {
            model: model.Category,
            as: "category",
            attributes: ["name"],
          },
        ],
      });
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
  show: async (data) => {
    try {
      const { productId } = data;
      const response = await model.Product.findOne({
        where: {
          id: productId,
        },
        attributes: { exclude: ["category_id"] },
        include: [
          {
            model: model.Category,
            as: "category",
          },
        ],
      });
      if (!response) {
        return {
          error: "Product not found",
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
  list: async (data) => {
    try {
      const { categoryId } = data;
      const checkCategory = await model.Category.findOne({
        where: {
          id: categoryId,
        },
      });
      if (!checkCategory) {
        return {
          error: "Category not found",
        };
      }
      const response = await model.Product.findAll({
        where: {
          category_id: categoryId,
        },
      });
      if (!response) {
        return {
          error: "Product not found",
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
  create: async (data, file) => {
    try {
      const { categoryId, ...productInfo } = data;
      const { path, filename } = file;
      const checkCategory = await model.Category.findByPk(categoryId);
      if (!checkCategory) {
        if (file) {
          cloudinary.uploader.destroy(filename);
        }
        return {
          error: "Category not found",
        };
      }
      const [response, created] = await model.Product.findOrCreate({
        where: {
          name: data.name,
        },
        defaults: {
          category_id: categoryId,
          img: path,
          ...productInfo,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      if (created) {
        return {
          data: "Product created successfully",
        };
      }
      if (file) {
        cloudinary.uploader.destroy(filename);
      }
      return {
        error: "Failed to create a new product",
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },

  update: async (data, file) => {
    try {
      const { categoryId, productId, ...productInfo } = data;
      const { path, filename } = file;
      console.log(filename);
      const checkProduct = await model.Product.findByPk(productId);
      if (!checkProduct) {
        if (file) {
          cloudinary.uploader.destroy(filename);
        }
        return {
          error: "Product not found",
        };
      }
      if (checkProduct.name == productInfo.name) {
        if (file) {
          cloudinary.uploader.destroy(filename);
        }
        return {
          error: "Name of product has been already used",
        };
      }

      if (categoryId) {
        const checkCategory = await model.Category.findByPk(categoryId);
        if (!checkCategory) {
          if (file) {
            cloudinary.uploader.destroy(filename);
          }
          return {
            error: "Category not found",
          };
        }
      }

      const response = await model.Product.update(
        {
          category_id: categoryId,
          img: path,
          ...productInfo,
          updated_at: new Date(),
        },
        {
          where: {
            id: productId,
          },
        }
      );
      if (response == 1) {
        return {
          data: "Product updated successfully",
        };
      }
      if (file) {
        cloudinary.uploader.destroy(filename);
      }
      return {
        error: "Failed to update product",
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },
  destroy: async (data) => {
    try {
      const { productId } = data;
      const checkProduct = await model.Product.findByPk(productId);
      if (!checkProduct) {
        return {
          error: "Product not found or has been deleted",
        };
      }
      const response = await model.Product.destroy({
        where: {
          id: productId,
        },
      });
      return {
        data:
          response == 1
            ? "Product deleted successfully"
            : "Failed to delete product",
      };
    } catch (error) {
      return {
        error: error.errors[0].message,
      };
    }
  },
};
