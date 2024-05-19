const rs = require("../helpers/error");
const jwt = require("jsonwebtoken");

module.exports = {
  auth: (req, res, next) => {
    let access_token = req.headers.authorization;
    if (access_token) {
      access_token = access_token.split(" ")[1];
      jwt.verify(access_token, process.env.JWT_SECRET_KEY, (error, user) => {
        if (error) {
          return rs.unauthorized(res, "Unauthorized");
        }
        if (user) {
          req.user = user;
          next();
        } else {
          return rs.unauthorized(res, "Unauthorized");
        }
      });
    } else {
      return rs.error(res, "Access token is required");
    }
  },
  admin: (req, res, next) => {
    if (req.user.role === "admin") {
      next();
    } else {
      return rs.unauthorized(res, "Unauthorized");
    }
  },
};