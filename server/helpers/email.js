import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const baseUrl = process.env.BASE_URL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendMail = (payload) => {
  const mailOptions = {
    from: process.env.EMAIL_ADDRESS,
    to: payload.email,
    subject: 'Reset Password',
    html: ` Hi ${payload.first_name}, click on this link to change password ${baseUrl}/auth/reset_password/${payload.user_id}}`,
  };
  return transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default sendMail;
