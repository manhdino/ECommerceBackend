const googleService = require("../services/google.services");
const rs = require("../helpers/error");

const redirectAuth = async (req, res) => {
  const url = await googleService.getGoogleAuthUrl();
  res.redirect(url);
};

const googleCallback = async (req, res) => {
  try {
    const { tokens } = await googleService.oAuth2client.getToken(
      req.query.code
    );
    const userInfo = await googleService.getUserInfo(tokens.access_token);
    const response = await googleService.findOrCreateUser(userInfo);
    if (!response.error) {
      res
        .status(200)
        .cookie("refresh_token", response.data.refreshToken, {
          httpOnly: true,
        })
        .cookie("access_token", response.data.access_token, {
          httpOnly: true,
        })
        .redirect("http://localhost:5173/home");
    } else {
      res.redirect("http://localhost:5173/sign-in");
    }
  } catch (err) {
    console.log(err);
    res.redirect("http://localhost:3000/api/auth/sign-in");
  }
};

module.exports = {
  redirectAuth,
  googleCallback,
};
