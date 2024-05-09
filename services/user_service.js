const { where } = require("sequelize");
const db = require("../database/models");
const authService = require("./auth_service")
// const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const User = db.User;

const phoneRegex = /^\d{10,11}$/;
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


const getAllUser = async (req) => {
    try {
        const allUser = await User.findAll({});
        return {
            success: true,
            user: allUser
        }
    }
    catch(err) {
        return {
            success:  false,
            message: err.message
        }
    }
}

const login = async (req) => {
    const username = req.body.username;
    if (phoneRegex.test(username)) {
        const foundUser = await User.findOne({
            where: {
                phone_number: username
            }
        })
        if (foundUser == null) {
            return {
                success: false,
                message: "Người dùng không tồn tại"
            }
        }
        if (req.body.password != null) {
            if (bcrypt.compare(req.body.password, foundUser.password)) {
                let refreshToken = foundUser.refreshToken;
                if (refreshToken === null || authService.verifyToken(refreshToken).success == false) {
                    refreshToken = authService.generateToken(foundUser.id, foundUser.role);
                    await User.update({
                        refreshToken: refreshToken
                    }, {where: {id: foundUser.id}})
                }
                return {
                    success: true,
                    message: "Đăng nhập thành công",
                    token: AuthService.generateToken(foundUser.id, foundUser.role),
                };
            }
            else {
                return {
                    success: false,
                    message: "Sai tài khoản hoặc mật khẩu"
                }
            }
        }
    }
    else if (emailRegex.test(input)) {
        const foundUser = await User.findOne({
            where: {
                email: username
            }
        })
        if (foundUser == null) {
            return {
                success: false,
                message: "Người dùng không tồn tại"
            }
        }
        if (req.body.password != null) {
            if (bcrypt.compare(req.body.password, foundUser.password)) {
                return {
                    success: true,
                    message: "Đăng nhập thành công",
                    token: AuthService.generateToken(foundUser.id)
                };
            }
            else {
                return {
                    success: false,
                    message: "Sai tài khoản hoặc mật khẩu"
                }
            }
        }
    }
    return null;
}

const register = async (req) => {
    try {
        if (phoneRegex.test(req.body.username)) {
            const foundUser = await User.findOne({
                where: {
                    phone_number: req.body.username
                }
            })
            if (foundUser != null) {
                return {
                    success: false,
                    message: "Người dùng đã tồn tại"
                }
            }
            const newUser = await User.create({
                firtName: req.body.firtName,
                lastName: req.body.lastName,
                email: req.body.email,
                password: await authService.hashPassword(req.body.password),
                phone_number: req.body.phone_number,
                role: "user",
                is_blocked: false,
            })
            return {
                success: true,
                message: "Đăng ký thành công"
            }
        }
        else if (emailRegex.test(input)) {
            const foundUser = await User.findOne({
                where: {
                    email: username
                }
            })
            if (foundUser == null) {
                return {
                    success: false,
                    message: "Người dùng đã tồn tại"
                }
            }
            const newUser = await User.create({
                firtName: req.body.firtName,
                lastName: req.body.lastName,
                phone_number: req.body.phone_number,
                password: await authService.hashPassword(req.body.password),
                phone_number: req.body.phone_number,
                role: "user",
                is_blocked: false,
            })
            return {
                success: true,
                message: "Đăng ký thành công"
            }
        }
        return null;
    }
    catch(err) {
        return {
            success: false,
            message: err.message
        }
    }
    return null;
}

module.exports = {
    getAllUser,
    login,
    register
}