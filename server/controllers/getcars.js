
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect().then(() => console.log('connected')).catch(err => console.log(err));

export default class CarQueries {
  static getAllCars(req, res) {
    const sql = 'SELECT * FROM Cars';
    try {
      if (!req.userData.is_admin) {
        return res.status(401).json({ status: 401, error: 'unauthorized' });
      }
      const result = client.query(sql);
      return result;
    } catch (error) {
      return error;
    }
  }
}
