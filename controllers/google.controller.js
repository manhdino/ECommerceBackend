const googleService = require("../services/google.services");
const rs = require("../helpers/error");

const redirectAuth = async (req, res) => {
  const url = await googleService.getGoogleAuthUrl();
  console.log(url);
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
    if (response.error) {
      rs.error(res, response.error);
    } else {
      rs.success(res, response);
    }
  } catch (err) {
    res.redirect("http://localhost:5173/sign-in");
  }
};

module.exports = {
  redirectAuth,
  googleCallback,
};
