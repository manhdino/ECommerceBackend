const googleService = require("../services/google.services");
const rs = require("../helpers/error");

const redirectAuth = async (req, res) => {
    try {
        const url = await googleService.getGoogleAuthUrl();
        res.redirect(url);
    }
    catch(err) {
        rs.error(res, "internal Server Error");
    }
}

const googleCallback = async(req, res) => {
    try {
        const {tokens} = await googleService.oAuth2client.getToken(req.query.code);
        const userInfor = await googleService.getUserInfor(tokens.access_token);
        console.log(userInfor);
        const response = await googleService.findOrCreateUser(userInfor);
        if (!response.error) {
            res.status(200)
            .cookie("refresh_token", response.data.refreshToken, {
                httpOnly: true
            })
            .cookie("access_token", response.data.access_token, {
                httpOnly: true,
            })
            .send({
                success: true,
                data: response.data,
                status: 200,
                message: "ok",
            });
        }
        else {
            rs.error(res, response.error);
        }
    }
    catch(err) {
        console.log(err);
        rs.error(res, "loi")
    }
}

module.exports = {
    redirectAuth,
    googleCallback
}