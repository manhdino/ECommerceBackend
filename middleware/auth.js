//Check Permissions
const {verifyToken} = require("../services/auth.services");
const jwt = require('jsonwebtoken')
const rs = require("../helpers/error");

const auth = async (req, res, next) => {
    // console.log('hello')
    const accessToken = req?.headers?.authorization;
    if (!accessToken) {
        return rs.error(res, "Access token is required");
    }
    try {
        const infor = verifyToken(accessToken.split(" ")[1]);
        // const infor = jwt.verify(accessToken.split(" ")[0], process.env.JWT_SECRET_KEY)
        if (!infor.error) {
            req.user = infor;
            return next();
        }
        else {
            return rs.unauthorized(res, "Unauthorized");
        }
    }
    catch(err) {
        return rs.unauthorized(res, "Unauthorized");
    }
}

const admin = async (req, res, next) => {
    if (req.user.role == "admin") {
        next;
    }
    else {
        return rs.unauthorized(res, "Unauthorized");
    }
}

module.exports = {
    auth,
    admin
}