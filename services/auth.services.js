const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rs = require("../helpers/error");
const db = require('../database/models');
const {sendMail, emailContent} = require('./mail.services');
const { where } = require('sequelize');
const User = db.User;

// const hashPassword = async (password) => {
//     console.log(password);
//     return bcrypt.hash(password, 10);
// }
const generateToken = async (userId, role, time) => {
    try{
        const payload = { userId: userId, role: role};
        const token =  jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: time });
        return {
            token
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
                // if (err) return ({
                //     success: false,
                //     message: 'Invalid token'
                // })
                if (err != null) throw err;
                return decoded.payload;
            }
        )
    } catch (err) {
        throw err;
        // console.log("[JWT] Error getting JWT token:", e.message)
    }
}

const signIn = async (data) => {
    try {
        const { email, password } = data;
        const checkUser = await model.User.findOne({
          where: {
            email: email,
          },
        });
        if (!checkUser) {
          return {
            error: "Email not found",
          };
        }
        if (checkUser.googleId) {
          return {
            error: "This email is registered as a Google account."
          }
        }
        const isPasswordValid = await bcrypt.compare(
          password,
          checkUser.password
        );
  
        if (!isPasswordValid) {
          return {
            error: "Invalid password",
          };
        }
        let refreshToken = checkUser.refreshToken;
        const checkVerify = authService.verifyToken(refreshToken);
        if (refreshToken === null || checkVerify === null) {
            refreshToken = authService.generateToken(checkUser.id, checkUser.role, "7d");
            await User.update({
                refreshToken: refreshToken
            }, {where: {id: checkUser.id}})
        }
        const access_token = jwt.sign(
          { userId: checkUser.id, role: checkUser.role },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "15m",
          }
        );
        return {
          data: {
            user: {
              id: checkUser.id,
              username: checkUser.username,
              email: checkUser.email,
              fullname: checkUser.fullname,
              role: checkUser.role,
              phone: checkUser.phone,
              address: checkUser.address,
              created_at: checkUser.created_at,
              updated_at: checkUser.updated_at,
            },
            refreshToken: refreshToken,
            access_token: access_token,
          },
        };
      } catch (error) {
        return {
          data: error.message,
        };
      }
}

const signUp = async (data) => {
    try {
        const { email, password } = data;
        const checkUser = await model.User.findOne({
          where: {
            email: email,
          },
        });
        if (checkUser) {
          return {
            error: "Email is already in used",
          };
        }
        const newUser = await model.User.create({
          email: email,
          password: password,
          username: email,
          created_at: new Date(),
          updated_at: new Date(),
        });
        return {
          data: {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            fullname: newUser.fullname,
            role: newUser.role,
            phone: newUser.phone,
            address: newUser.address,
            created_at: newUser.created_at,
            updated_at: newUser.updated_at,
          },
        };
      } catch (error) {
        return {
          data: error.message,
        };
      }
}

const refreshToken = async (refreshToken) => {
    try {
        const checkVerify = await verifyToken(refreshToken)
        if (checkVerify) {
            const response = await User.findOne({id: checkVerify.id, refreshToken: refreshToken})
            return ({
                accessToken: response ? jwt.sign(checkVerify, process.env.JWT_SECRET, { expiresIn: '15m' }) : null
            })
        }
    } catch (err) {
        return ({
            error: err.message,
        });
    }
}

const changePassword = async (email, newPassword) => {
  try {
    const user = await model.User.findOne({
      where: {
        email: email
      }
    })
    if (!user) {
      return {
        error: "Email not found"
      };
    }
    if (user.googleId) {
      return {
        error: "This email is registered as a Google account."
      }
    }
    user.password = newPassword;
    user.passwordCode = null;
    await user.save();
    return {
      message: "password updated"
    }
  }
  catch (err) {
    return {
      error: err
    }
  }
}

const forgotPassword = async (email) => {
  try {
    const user = await User.findOne({
      where: email
    })
    if (!user) {
      return {
        error: "Email not found"
      }
    }
    if (user.googleId) {
      return {
        error: "This email is registered as a Google account."
      }
    }
    const host = req.header('host');
    const code = crypto.randomInt(100000, 1000000);
    user.passwordCode = code;
    await user.save();
    const token = jwt.sign({userId : user.id, role: user.role, code: code}, process.env.JWT_SECRET_KEY, {expiresIn: '5m'});
    const resetLink = `${req.protocol}://${host}/reset?token=${token}&email=${email}`;
    const html = emailContent(user.fullname, host, resetLink);
    const response = await sendMail(email, html);
    if (response.error) {
      return {
        error: response.error
      }
    }
    return {
      data: response.info
    }
  }
  catch(err) {
    return {
      error: err
    }
  }
}

const verifyLink = async (email, token) => {
  try {
    let decoded = verifyToken(token);
    if (!decoded) {
      return {
        error: "Invalid token"
      }
    }
    const user = await User.findOne({where: {
      id: decoded.id
    }})
    if (user.passwordCode != decoded.code) {
      return {
        error: "invalid Link"
      }
    }
    return {
      success: "Valid Link"
    }
  }
  catch(err) {
    return {
      error: err
    }
  }
}

module.exports = {
    generateToken,
    verifyToken,
    refreshToken,
    signIn,
    signUp,
    changePassword,
    forgotPassword,
    verifyLink
}