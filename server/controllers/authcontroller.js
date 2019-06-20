
/* eslint-disable camelcase */
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { Client } from 'pg';
import sendMail from '../helpers/email';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect().then(() => console.log('connected')).catch(err => console.log(err));

const secret = process.env.JWT_KEY;
const expiresIn = process.env.TOKEN_EXPIRY;

const generateUserToken = (user) => {
  const dataStoredInToken = {
    id: user.id,
    email: user.email,
    is_admin: user.is_admin,
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
    let { is_admin } = req.body;
    if (is_admin === undefined) {
      is_admin = false;
    }
    const hashedPassword = bcrypt.hashSync(req.body.password);
    const createQuery = `
    INSERT INTO Users(email, first_name, last_name, password, address, is_admin)
    VALUES ('${email}', '${first_name}', '${last_name}', '${hashedPassword}', '${address}', '${is_admin}')
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

    const validUser = 'SELECT * FROM Users WHERE email = $1';

    const { rows } = await client.query(validUser, [email]);
    if (!rows[0]) {
      return res.status(401).json({ status: 401, error: 'No user with the email, sign up instead' });
    }

    const payload = {
      first_name: rows[0].first_name,
      user_id: rows[0].id,
      email: rows[0].email,
    };
    await sendMail(payload);

    return res.status(200).json({
      status: 200,
      message: `A link has been sent to ${rows[0].email} enter link to change password`,
    });
  },

  async resetPassword(req, res) {
    const { user_id } = req.params;
    const validUser = 'SELECT * FROM Users WHERE id = $1';
    console.log(user_id);

    const { rows } = await client.query(validUser, [user_id]);
    if (!rows[0]) {
      return res.status(401).json({ status: 401, error: 'No user with the email, sign up instead' });
    }

    const hashedPassword = bcrypt.hashSync(req.body.newPassword);

    const updateCar = `UPDATE Users SET password = '${hashedPassword}' WHERE id = ${user_id} RETURNING *`;
    const result = await client.query(updateCar);
    return res.status(200).json({
      status: 200,
      data: result.rows[0],
      message: 'You have successfully changed your password',
    });
  },
};

export default AuthControllers;
