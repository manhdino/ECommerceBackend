const nodemailer = require("nodemailer");

const sendMail = async (email, html) => {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_NAME,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
    let info = await transporter.sendMail({
      from: '"ShoeStore" <no-relply@vanminh.com>',
      to: email,
      subject: "Reset password",
      html: html,
    });
    return info;
  } catch (err) {
    return {
      error: err,
    };
  }
};

const emailContent = (username, resetLink) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
          }
          .email-container {
              background-color: #ffffff;
              margin: 20px auto;
              padding: 20px;
              max-width: 600px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .email-header {
              text-align: center;
              border-bottom: 1px solid #dddddd;
              padding-bottom: 10px;
          }
          .email-body {
              padding: 20px;
          }
          .email-footer {
              text-align: center;
              border-top: 1px solid #dddddd;
              padding-top: 10px;
              font-size: 0.9em;
              color: #888888;
          }
          .button {
              display: inline-block;
              padding: 10px 20px;
              margin: 20px 0;
              font-size: 16px;
              color: #ffffff !important;
              background-color: #007bff;
              text-decoration: none;
              border-radius: 5px;
          }
      </style>
  </head>
  <body>
      <div class="email-container">
          <div class="email-header">
              <h2>Reset Your Password</h2>
          </div>
          <div class="email-body">
              <h3>Hello ${username},</h3>
              <p>You recently requested to reset the password for your account.<br />
              Click the link below to proceed:</p>
              <p style="text-align: center;">
                  <a href="${resetLink}" class="button">Reset Password</a>
              </p>
              <p>If you did not request a password reset, please ignore this email or reply to let us know.<br/>
              This password reset link is only valid for the next 5 minutes.</p>
              <p>Thanks,<br />
          </div>
          <div class="email-footer">
              <p>&copy; ${new Date().getFullYear()}. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
  `;
};

module.exports = {
  sendMail,
  emailContent,
};

