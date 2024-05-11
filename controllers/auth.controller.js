const authService = require("../services/auth.services");
const rs = require("../helpers/error");
const { email, password, confirmPassword } = require("../helpers/validator");
const Joi = require("joi");

const signIn = async (req, res) => {
    try {
        const { error } = Joi.object({
          email,
          password,
        }).validate(req.body, {
          errors: { wrap: { label: "" } },
        });
        if (error) {
          return rs.validate(res, error.details[0].message);
        }
  
        const response = await authService.signIn(req.body);
  
        if (response.error) {
          return rs.error(res, response.error);
        }
        const data = response.data;
        if (response) {
          res
            .status(200)
            .cookie("refresh_token", response.data.refreshToken, {
                httpOnly: true
            })
            .cookie("access_token", response.data.access_token, {
                httpOnly: true,
            })
            .send({
                success: true,
                data,
                status: 200,
                message: "ok",
            });
        }
      } catch (error) {
        return rs.error(res, error.message);
      }
}

const signUp = async (req, res) => {
    try {
        const { error } = Joi.object({
          email,
          password,
          confirmPassword,
        }).validate(req.body, {
          errors: { wrap: { label: "" } },
        });
        if (error) {
          return rs.validate(res, error.details[0].message);
        }
        const response = await authService.signUp(req.body);
  
        if (response.error) {
          return rs.error(res, response.error);
        }
        if (response) {
          return rs.success(res, response);
        }
      } catch (error) {
        return rs.error(res, error.message);
      }
}

const signOut = (req, res) => {
    try {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return rs.success(res, "Sign out successfully");
    } catch (error) {
        return rs.error(res, error.message);
    }
}

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req?.body?.refreshToken;
        if (!refreshToken) {
            return rs.error(res, "Unauthorized");
        }
        const response = await authService.refreshToken(refreshToken);
        if (response.error) {
            return rs.error(res, response.error)
        }
        return rs.success(res, response)
    }
    catch (err) {
        return rs.error(res, err.message);
    }
}

module.exports = {
    signIn,
    signUp,
    signOut,
    refreshToken
}