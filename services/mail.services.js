const nodemailer = require('nodemailer')
const sendMail = async (email, html) => {
    try{
        let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_APP_PASSWORD,
            },
        });
        let info = await transporter.sendMail({
            from: '"vanminh" <no-relply@vanminh.com>',
            to: email,
            subject: "Forgot password",
            html: html,
        });
        return info
    }
    catch (err) {
        return {
            error: err
        }
    }
}

const emailContent = (fullname, host, resetLink) => {
    return `
        Hello ${fullname},

        You recently requested to reset the password for your ${host} account.
        Click the link below to proceed.

        <a href="${resetLink}">Reset Password</a>

        If you did not request a password reset, please ignore this email or reply to let us know. This password reset link is only valid for the next 5 minutes.

        Thanks,
    `;
}

module.exports = {
    sendMail,
    emailContent
}