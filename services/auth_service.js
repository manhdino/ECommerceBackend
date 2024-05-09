const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../database/models');
const User = db.User;

const hashPassword = async (password) => {
    console.log(password);
    return bcrypt.hash(password, 10);
}
const generateToken = async (id, role) => {
    try{
        const payload = { id: id, role: role};
        const refreshToken =  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
        return {
            accessToken,
            refreshToken
        }
    }
    catch(err) {
        return {
            error: err
        }
    }
}

const verifyToken = (token) => {
    try {
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            (err, decoded) => {
                if (err) return ({
                    success: false,
                    message: 'Invalid token'
                })
                if (err != null) throw err;
                return decoded.payload;
            }
        )
    } catch (err) {
        throw err;
        // console.log("[JWT] Error getting JWT token:", e.message)
    }
}

const refreshToken = async (req, res) => {
    try {
        const refreshToken = req?.body?.refreshToken
        if (!refreshToken)
            return ({
                success: false,
                message: "Unauthorized",
            });
        const rs = await verifyToken(refreshToken)
        const response = await User.findOne({id: rs.id, refreshToken: refreshToken})
        return ({
            success: response ? true : false,
            accessToken: response ? JwtService.jwtSign(rs, {expiresIn: '15m'}) : null
        })
    } catch (e) {
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal Server Error',
        });
    }
}

module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    refreshToken
}