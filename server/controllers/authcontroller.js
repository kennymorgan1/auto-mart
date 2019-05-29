/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import dotenv from 'dotenv';
import users from '../model/authdata';

dotenv.config();

const secret = process.env.JWT_KEY;
const expiresIn = process.env.TOKEN_EXPIRY;

export default class AuthControllers {
  static createUser(req, res) {
    // eslint-disable-next-line consistent-return
    users.forEach((user) => {
      if (user.email === req.body.email) {
        return res.status(409).json({
          status: 409,
          error: 'User with email already exist',
        });
      }
    });
    const hashedPassword = bcrypt.hashSync(req.body.password);
    const id = users.length + 1;
    // eslint-disable-next-line object-curly-newline
    const { email, first_name, last_name, address } = req.body;
    const user = {
      id,
      email,
      first_name,
      last_name,
      password: hashedPassword,
      address,
      is_admin: true,
    };

    users.push(user);
    const dataStoredInToken = {
      id: user.id,
      email: user.email,
    };
    const token = jwt.sign(dataStoredInToken, secret, { expiresIn });

    // eslint-disable-next-line object-curly-newline
    const data = { token, id, first_name, last_name, email };
    return res.status(201).json({ status: 201, data });
  }
}
