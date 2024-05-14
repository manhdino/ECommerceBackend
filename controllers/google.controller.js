const googleService = require("../services/google.services");
const rs = require("../helpers/error");

const redirectAuth = async (req, res) => {
    try {
        const url = await googleService.getGoogleAuthUrl();
        // res.redirect(url);
        rs.success(res, {data: url});
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
            .redirect('http://localhost:3000/home');
        }
        else {
            res.redirect('http://localhost:3000/api/auth/sign-in');
        }
    }
    catch(err) {
        console.log(err);
        res.redirect('http://localhost:3000/api/auth/sign-in');
    }
}

module.exports = {
    redirectAuth,
    googleCallback
}