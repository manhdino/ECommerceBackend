const authService = require("../services/auth.services");
const rs = require("../helpers/error");
const {
  email,
  password,
  username,
  confirmPassword,
} = require("../validations/user.validation");
const validator = require("../helpers/validator");

module.exports = {
  signIn: async (req, res) => {
    try {
      const { error } = validator({ email, password }, req.body);
      if (error) {
        return rs.validate(res, error.details[0].message);
      }

      const response = await authService.signIn(req.body);

      if (response.error) {
        return rs.error(res, response.error);
      }
      return rs.success(res, response);
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  signUp: async (req, res) => {
    try {
      const { error } = validator(
        { username, email, password, confirmPassword },
        req.body
      );
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
  },
  signOut: async (req, res) => {
    try {
      res.clearCookie("access_token");
      return rs.success(res, {
        data: "Sign out successfully",
      });
    } catch (error) {
      return rs.error(res, error.message);
    }
  },
  forgotPassword: async (req, res) => {
    const { error } = validator({ email }, req.body);
    if (error) {
      return rs.validate(res, error.details[0].message);
    }
    const response = await authService.forgotPassword(
      req.body.email,
      req.header("host"),
      req.protocol
    );
    if (response.error) {
      return rs.error(res, response.error);
    }
    return rs.success(res, {
      data: "Email has been sent successfully. Please check your inbox to reset your password",
    });
  },
  resetPassword: async (req, res) => {
    const { error } = validator(
      { password, confirmPassword },
      { password: req.body.password, confirmPassword: req.body.confirmPassword }
    );

    if (error) {
      return rs.validate(res, error.details[0].message);
    }
    const token = req.body.resetPasswordToken;
    if (!token) {
      rs.error(res, "Unauthorized");
    }
    const response = await authService.resetPassword(token, req.body);
    if (response.error) {
      return rs.error(res, response.error);
    }
    if (response.error) {
      return rs.error(res, response.error);
    }
    res.clearCookie("resetPasswordToken");
    return rs.success(res, response);
  },
  verifyLink: async (req, res) => {
    try {
      const token = req.query.token;
      const response = await authService.verifyLink(token);
      if (response.error) {
        res.redirect("http://localhost:5173/sign-in");
      } else {
        res
          .redirect(`http://localhost:5173/reset-password?token=${token}`);
      }
    }
    catch(err) {
      res.redirect("http://localhost:5173/sign-in")
    }
  },

  refreshToken: async (req, res) => {
    try {
      const refreshToken = req?.body?.refreshToken;
      if (!refreshToken) {
        return rs.error(res, "Unauthorized");
      }
      const response = await authService.refreshToken(refreshToken);
      if (response.error) {
        return rs.error(res, response.error);
      }
      return rs.success(res, response);
    } catch (err) {
      return rs.error(res, err.message);
    }
  },

};

