const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const rs = require("../helpers/error");
const db = require('../database/models');
const {sendMail, emailContent} = require('./mail.services');
const { where } = require('sequelize');
// const { phone } = require('../validations/auth.validation');
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
        return jwt.verify(token, process.env.JWT_SECRET_KEY)
            // (err, decoded) => {
            //     if (err) return ({
            //         success: false,
            //         message: 'Invalid token'
            //     })
            //     // if (err != null) throw err;
            //     return decoded.payload;
            // }
    } catch (err) {
        // console.log("[JWT] Error getting JWT token:", err.message)
        return{
          error: err
        } ;
    }
}

const signIn = async (data) => {
    try {
        const { email, password } = data;
        const checkUser = await User.findOne({
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
        // let checkVerify;
        // if (refreshToken != null) {
        //   checkVerify = verifyToken(refreshToken);
        // }
        // if (refreshToken === null || checkVerify.error) {
        refreshToken = await generateToken(checkUser.id, checkUser.role, "7d");
          await User.update({
              refreshToken: refreshToken.token
          }, {where: {id: checkUser.id}})
          console.log('tao refresh token thanh cong')
        // }
        const access_token = jwt.sign(
          { userId: checkUser.id, role: checkUser.role },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "1d",
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
          error: error.message,
        };
      }
}

const signUp = async (data) => {
    try {
        const checkUser = await User.findOne({
          where: {
            email: data.email,
          },
        });
        if (checkUser) {
          return {
            error: "Email is already in used",
          };
        }
        const newUser = await User.create({
          email: data.email,
          password: data.password,
          username: data.email,
          phone: data.phone,
          fullname: data.fullname,
          address: data.address,
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
          error: error.message,
        };
      }
}

const signOut = async (userId) => {
  try {
    const user = await User.findOne({where: {id: userId}});
    user.refreshToken = null;
    await user.save();
    return {
      success: true
    }
  }
  catch(err) {
    return {
      error: err
    }
  }
}

const refreshToken = async (refreshToken) => {
    try {
        const checkVerify = await verifyToken(refreshToken)
        if (checkVerify.userId) {
            const response = await User.findOne({id: checkVerify.id, refreshToken: refreshToken})
            return ({
                success: response ? true: false,
                accessToken: response ? jwt.sign(checkVerify, process.env.JWT_SECRET, { expiresIn: '1d' }) : null
            })
        }
        if (checkVerify.error) {
          return ({
            success: false,
            message: "refresh token is expired"
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
    const user = await User.findOne({
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
    const token = jwt.sign({userId : user.id, role: user.role, code: code}, process.env.JWT_SECRET_KEY, {expiresIn: '1d'});
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
    if (decoded.error) {
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
    signOut,
    changePassword,
    forgotPassword,
    verifyLink
}