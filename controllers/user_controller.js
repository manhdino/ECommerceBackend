const UserService = require("../services/user_service");

const getAllUser = async (req, res) => {
    const resp = await UserService.getAllUser(req);
    if (resp.success == true) {
        res.status(200).json(resp);
    }
    else {
        res.status(500).json({error: resp.message});
    }
}

const testAccessDenied = async (req, res) => {
    res.status(200).json({error: "unauthorized"})
}

module.exports = {
    getAllUser,
    testAccessDenied
}