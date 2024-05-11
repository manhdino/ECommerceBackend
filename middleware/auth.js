//Check Permissions
const {verifyToken} = require("../services/auth.services");
const rs = require("../helpers/error");

const auth = async (req, res, next) => {
    const accessToken = req?.headers?.authorization;
    if (!accessToken) {
        return rs.error(res, "Access token is required");
    }
    try {
        const infor = await verifyToken(accessToken.split(' ')[1]);
        req.user = infor;
        next;
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