import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// eslint-disable-next-line consistent-return
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          status: '401',
          message: 'Authorization failed',
        });
      }
      req.userData = decoded;
      return next();
    });
  } catch (err) {
    return res.status(401).send({
      status: '401',
      message: 'Authorization failed',
    });
  }
};
export default authenticate;
