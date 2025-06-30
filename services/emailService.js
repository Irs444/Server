const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'email',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
})

const sendOTPEmail = async (email, otp) => {
  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset OTP',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="font-size: 16px; color: #555;">
          Use the following OTP to reset your password:
        </p>
        <div style="background: #f5f5f5; padding: 15px; text-align: center; margin: 20px 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
          ${otp}
        </div>
        <p style="font-size: 14px; color: #777;">
          This OTP will expire in 10 minutes.
        </p>
        <p style="font-size: 14px; color: #777; margin-top: 30px;">
          If you didn't request this, please ignore this email.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOption)
}

module.exports = { sendOTPEmail }