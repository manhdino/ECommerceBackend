//Check Permissions
const {verifyToken} = require("../services/auth_service")

const authMiddleware = async (req, res, next) => {
    const accessToken = req?.headers?.authorization;
    if (!accessToken) {
        res.status(404).json({message: "access token is required"})
    }
    try {
        req.body.infor = await verifyToken(accessToken.split(' '[1]));
        next;
    }
    catch(err) {
        res.status(500).json({message: err});
    }
}