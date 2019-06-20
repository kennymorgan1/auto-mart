
/* eslint-disable arrow-body-style */
/* eslint-disable camelcase */
import dotenv from 'dotenv';
import { Client } from 'pg';

const cloudinary = require('cloudinary').v2;


dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET,
});

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect().then(() => console.log('connected')).catch(err => console.log(err));


const CarsControllers = {
  async postCar(req, res) {
    // eslint-disable-next-line object-curly-newline
    const { state, price, manufacturer, model, body_type } = req.body;
    const owner = req.userData.id;
    const { email } = req.userData;
    const created_on = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const status = 'available';
    const carQuery = `INSERT INTO Cars(state, price, manufacturer, model, body_type, owner, email, created_on, status) VALUES ('${state}', '${price}', '${manufacturer}', '${model}', '${body_type}', '${owner}', '${email}', '${created_on}', '${status}') RETURNING *`;
    try {
      const { rows } = await client.query(carQuery);
      return res.status(201).json({ status: 201, data: rows[0] });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async updateCarStatus(req, res) {
    const { status } = req.body;
    const { car_id } = req.params;
    const validCar = 'SELECT * FROM Cars WHERE id = $1 AND owner = $2';
    const updateCar = `UPDATE Cars SET status = '${status}' WHERE id = ${car_id} RETURNING *`;

    try {
      const { rows } = await client.query(validCar, [car_id, req.userData.id]);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: 'Invalid car selected' });
      }
      const result = await client.query(updateCar);
      const data = result.rows[0];
      return res.status(200).json({ status: 200, data });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async updateCarPrice(req, res) {
    const { price } = req.body;
    const { car_id } = req.params;
    const validCar = 'SELECT * FROM Cars WHERE id = $1 AND owner = $2';
    const updateCar = `UPDATE Cars SET price = '${price}' WHERE id = ${car_id} RETURNING *`;

    try {
      const { rows } = await client.query(validCar, [car_id, req.userData.id]);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: 'Invalid car selected' });
      }
      const result = await client.query(updateCar);
      const data = result.rows[0];
      return res.status(200).json({ status: 200, data });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async getOneCar(req, res) {
    const oneCarQuery = 'SELECT * FROM Cars WHERE id = $1';
    const params = [req.params.car_id];
    try {
      const { rows } = await client.query(oneCarQuery, params);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Car not found',
        });
      }
      return res.status(200).json({
        status: 200,
        data: rows[0],
      });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async getCars(req, res) {
    let result;
    const { status, min_price, max_price } = req.query;

    if (status && min_price && max_price) {
      const sql = 'SELECT * FROM Cars WHERE status >= $1 AND price >= $2 AND price <= $3';
      result = await client.query(sql, [status, min_price, max_price]);
    } else if (status) {
      const sql = 'SELECT * FROM Cars WHERE status >= $1';
      result = await client.query(sql, [status]);
    } else {
      if (!req.userData.is_admin) {
        return res.status(401).json({ status: 401, error: 'unauthorized' });
      }
      const sql = 'SELECT * FROM Cars';
      result = await client.query(sql);
    }
    try {
      if (result.rowCount === 0) {
        return res.status(404).json({ status: 404, error: 'Car not found' });
      }
      return res.status(200).json({ status: 200, data: result.rows });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },

  async deleteCar(req, res) {
    const { car_id } = req.params;
    const deleteQuery = ` DELETE FROM Cars WHERE id = ${Number(car_id)} RETURNING id`;

    try {
      if (!req.userData.is_admin) {
        return res.status(401).json({ status: 401, error: 'Not permited to complete this action' });
      }
      const { rows } = await client.query(deleteQuery);
      return res.status(200).json({ status: 200, data: 'Car Ad successfully deleted', rows });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },
};


export default CarsControllers;
