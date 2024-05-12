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
            return rs.success(res, "Dang nhap thanh cong");
        }
        return rs.error(res, "Dang nhap khong thanh cong");
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