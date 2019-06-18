
/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Client } from 'pg';
import users from '../model/authdata';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect().then(() => console.log('connected')).catch(err => console.log(err));

const secret = process.env.JWT_KEY;
const expiresIn = process.env.TOKEN_EXPIRY;
const baseUrl = process.env.BASE_URL;

const generateUserToken = (user) => {
  const dataStoredInToken = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(dataStoredInToken, secret, { expiresIn });
  return token;
};

const AuthControllers = {
  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} users object
   */
  async createUser(req, res) {
    // eslint-disable-next-line consistent-return
    const validUser = 'SELECT * FROM Users WHERE email = $1';

    const params = [req.body.email];
    // eslint-disable-next-line object-curly-newline
    const { email, first_name, last_name, address } = req.body;
    const hashedPassword = bcrypt.hashSync(req.body.password);
    const createQuery = `
    INSERT INTO Users(email, first_name, last_name, password, address)
    VALUES ('${email}', '${first_name}', '${last_name}', '${hashedPassword}', '${address}')
    RETURNING *
  `;
    try {
      const { rows } = await client.query(validUser, params);
      if (rows[0]) {
        return res.status(409).json({ status: 409, error: 'User with email already exist' });
      }
      const result = await client.query(createQuery);
      const token = generateUserToken(result.rows[0]);
      // eslint-disable-next-line object-curly-newline
      const data = result.rows[0];
      return res.status(201).json({ status: 201, data, token });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async loginUser(req, res) {
    const { email, password } = req.body;

    const validUser = 'SELECT * FROM Users WHERE email = $1';
    const params = [email];

    const { rows } = await client.query(validUser, params);
    if (!rows[0]) {
      return res.status(401).json({ status: 401, error: 'Username or password is incorrect' });
    }
    const isPasswordMatching = bcrypt.compareSync(
      password, rows[0].password,
    );
    if (isPasswordMatching) {
      const token = generateUserToken(rows[0]);
      const data = rows[0];
      return res.status(200).json({ status: 200, data, token });
    }
    return res.status(401).json({ status: 401, error: 'Username or password is incorrect' });
  },

  async forgetPassword(req, res) {
    const { email } = req.body;
    const user = users.find(result => result.email === email);
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'No user with the email, sign up instead',
      });
    }
    return res.status(200).json({
      status: 200,
      data: user,
      message: `Access this route and supply new password ${baseUrl}/auth/reset_password/${user.id}`,
    });
  },

  async resetPassword(req, res) {
    const user = users.find(result => result.id === parseFloat(req.params.user_id));
    if (!user) {
      return res.status(404).json({
        status: 404,
        error: 'No user with the email, sign up instead',
      });
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword);
    user.password = hashedPassword;
    return res.status(200).json({
      status: 200,
      message: 'You have successfully changed your password',
    });
  },
};

export default AuthControllers;
