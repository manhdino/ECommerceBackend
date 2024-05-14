module.exports = {
  success: (res, data) => {
    return res.status(200).send({
      success: true,
      ...data,
      status: 200,
      message: "ok",
    });
  },
  validate: (res, message) => {
    return res.status(422).send({
      success: false,
      status: 422,
      message: message,
    });
  },
  error: (res, message) => {
    return res.status(404).send({
      success: false,
      status: 404,
      message: message,
    });
  },
  unauthorized: (res, message) => {
    return res.status(401).send({
      success: false,
      status: 401,
      message: message,
    });
  },
};
