const googleService = require("../services/google.services");
const rs = require("../helpers/error");

const redirectAuth = async (req, res) => {
  const url = await googleService.getGoogleAuthUrl();
  const response = {
    data: url,
  };
  return rs.success(res, response);
};

const getInforFromGoogle = async (req, res) => {
  try {
    const { tokens } = await googleService.oAuth2client.getToken(
      req.body.codeAuth
    );
    const userInfo = await googleService.getUserInfo(tokens.access_token);
    console.log(userInfo)
    const response = await googleService.findOrCreateUser(userInfo);
    // console.log(response);
    if (!response.error) {
      rs.success(res, response)
    } else {
      rs.error(res, response.error)
    }
  } catch (err) {
    rs.error(res, err)
  }
};

module.exports = {
  redirectAuth,
  getInforFromGoogle,
};

