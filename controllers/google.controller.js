const googleService = require("../services/google.services");
const rs = require("../helpers/error");

const redirectAuth = async (req, res) => {
  const url = await googleService.getGoogleAuthUrl();
  const response = {
    data: url,
  };
  return rs.success(res, response);
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
        .cookie("userInfo", response.data.user)
        .cookie("refresh_token", response.data.refreshToken, {
          httpOnly: true,
        })
        .cookie("access_token", response.data.accessToken, {
          httpOnly: true,
        })
        .redirect("http://localhost:5173");
    } else {
      res.redirect("http://localhost:5173/sign-in");
    }
  } catch (err) {
    res.redirect("http://localhost:5173/sign-in");
  }
};

module.exports = {
  redirectAuth,
  googleCallback,
};
