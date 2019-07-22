import dotenv from 'dotenv';
import SGmail from '@sendgrid/mail';

dotenv.config();

const baseUrl = process.env.BASE_URL;

const sendMail = (payload) => {
  SGmail.setApiKey(process.env.EMAIL_KEY);
  const msg = {
    to: payload.email,
    from: 'email@automart.com',
    subject: 'Reset Password',
    html: `<p>Hi ${payload.first_name}, click on this link to change password ${baseUrl}/auth/reset_password/${payload.user_id}}</p>`,
  };

  SGmail.send(msg);
};

export default sendMail;
