export const generateEmailTemplate = (verificationCode, name) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Email Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 10px;
        padding: 20px;
        box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #eeeeee;
      }
      .header h2 {
        color: #333333;
        margin: 0;
      }
      .content {
        padding: 20px;
        text-align: center;
        color: #555555;
      }
      .code-box {
        font-size: 26px;
        font-weight: bold;
        color: #007bff;
        letter-spacing: 4px;
        margin: 20px auto;
        padding: 12px 24px;
        display: inline-block;
        border: 2px dashed #007bff;
        border-radius: 6px;
        background-color: #f8fbff;
      }
      .footer {
        text-align: center;
        padding: 15px;
        font-size: 12px;
        color: #999999;
      }
      @media only screen and (max-width: 600px) {
        .container {
          width: 90% !important;
          padding: 15px !important;
        }
        .code-box {
          font-size: 22px !important;
          padding: 10px 18px !important;
          letter-spacing: 3px !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Email Verification</h2>
      </div>
      <div class="content">
        <p>Hello <b>${name}</b>,</p>
        <p>Thank you for signing up! Use the following verification code to complete your registration:</p>
        <div class="code-box">${verificationCode}</div>
        <p>This code will expire in <b>5 minutes</b>. Please do not share it with anyone.</p>
      </div>
      <div class="footer">
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p><b>Note:</b> This is an automated email. Please do not reply.</p>
        <p>© ${new Date().getFullYear()} Navneet Authentication System</p>
      </div>
    </div>
  </body>
  </html>
  `;
};

export const forgotPasswordEmail = (resetPasswordUrl, name) => {
  return `
  <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Your Password</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f7;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0px 4px 8px rgba(0,0,0,0.1);
      }
      .header {
        background: #0970e4ff;
        color: white;
        text-align: center;
        padding: 20px;
      }
      .content {
        padding: 30px;
        color: #333333;
        line-height: 1.6;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 20px;
        background: #0d75ecff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      }
      .plain-link {
        margin-top: 20px;
        font-size: 14px;
        color: #555;
        word-break: break-word;
      }
      .footer {
        text-align: center;
        padding: 20px;
        font-size: 12px;
        color: #888888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Password Reset Request</h2>
      </div>
      <div class="content">
        <p>Hi ${name},</p>
        <p>You recently requested to reset your password. Click the button below to set a new one:</p>
        <a href="${resetPasswordUrl}" class="button">Reset Password</a>
        <p>If the button above doesn’t work, copy and paste the URL below into your browser:</p>
        <p class="plain-link">${resetPasswordUrl}</p>
        <p>If you did not request this, you can safely ignore this email. Your account will remain secure.</p>
        <p>This link will expire in <strong>15 minutes</strong>.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Navneet Singh. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
  `;
};
