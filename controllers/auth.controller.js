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
      const data = response.data;
      if (response) {
        res
          .status(200)
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
      data: "An email has been sent successfully. Please check your inbox to reset your password",
    });
  },
  resetPassword: async (req, res) => {
    const { error } = validator(
      { password, confirmPassword },
      { password: req.body.password, confirmPassword: req.body.confirmPassword }
    );
    if (error) {
      res.clearCookie("passwordCode");
      return rs.validate(res, error.details[0].message);
    }
    const token = req.body.passwordCode;
    const response = await authService.resetPassword(token, req.body.password);
    if (response.error) {
      res.clearCookie("passwordCode");
      return rs.error(res, response.error);
    }
    res.clearCookie("passwordCode");
    return rs.success(res, response.data);
  },
  verifyLink: async (req, res) => {
    const token = req.query.token;
    const email = req.query.email;
    const response = await authService.verifyLink(email, token);
    if (response.error) {
      res.redirect("http://localhost:5173/loi"); //chuyen den trang link loi ben fe
    } else {
      res.cookie("passwordCode", token).redirect("http://localhost:5173/oke"); //chuyen den trang reset password
    }
  },
};
