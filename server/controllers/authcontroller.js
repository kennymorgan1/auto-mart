/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import dotenv from 'dotenv';
import users from '../model/authdata';

dotenv.config();

const secret = process.env.JWT_KEY;
const expiresIn = process.env.TOKEN_EXPIRY;

const generateUserToken = (user) => {
  const dataStoredInToken = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(dataStoredInToken, secret, { expiresIn });
  return token;
};

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
    const token = generateUserToken(user);

    // eslint-disable-next-line object-curly-newline
    const data = { token, id, first_name, last_name, email };
    return res.status(201).json({ status: 201, data });
  }

  static loginUser(req, res) {
    const { email, password } = req.body;
    const user = users.find(result => result.email === email);
    if (!user) {
      return res.status(401).json({
        status: 401,
        error: 'Username or password is incorrect',
      });
    }
    const isPasswordMatching = bcrypt.compareSync(
      password, user.password,
    );
    if (isPasswordMatching) {
      const token = generateUserToken(user);
      const data = {
        token,
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email,
      };
      return res.status(200).json({ status: 200, data });
    }
    return res.status(401).json({ status: 401, error: 'Username or password is incorrect' });
  }
}
