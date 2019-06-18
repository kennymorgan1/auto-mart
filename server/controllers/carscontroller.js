
/* eslint-disable arrow-body-style */
/* eslint-disable camelcase */
import dotenv from 'dotenv';
import { Client } from 'pg';
import cars from '../model/carsdata';

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
    console.log(req.userData);
    const owner = req.userData.id;
    const { email } = req.userData;
    const created_on = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const status = 'available';
    const carQuery = `INSERT INTO Cars(state, price, manufacturer, model, body_type, owner, email, created_on, status) VALUES ('${state}', '${price}', '${manufacturer}', '${model}', '${body_type}', '${owner}', '${email}', '${created_on}', '${status}') RETURNING *`;
    try {
      const { rows } = await client.query(carQuery);
      return res.status(201).json({ status: 201, data: rows[0] });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, error });
    }
  },

  async updateCarStatus(req, res) {
    const { status } = req.body;

    const car = cars.find((result) => {
      return (result.id === parseFloat(req.params.car_id) && (result.owner === req.userData.id));
    });
    if (!car) {
      return res.status(404).json({
        status: 404,
        error: 'Invalid car selected',
      });
    }
    car.status = status;
    return res.status(200).json({ status: 200, data: car });
  },

  async updateCarPrice(req, res) {
    const { price } = req.body;

    const car = cars.find((result) => {
      return (result.id === parseFloat(req.params.car_id) && (result.owner === req.userData.id));
    });
    if (!car) {
      return res.status(404).json({
        status: 404,
        error: 'Invalid car selected',
      });
    }
    car.price = price;
    return res.status(200).json({ status: 200, data: car });
  },

  async getOneCar(req, res) {
    const car = cars.find(result => result.id === parseFloat(req.params.car_id));
    if (!car) {
      return res.status(404).json({
        status: 404,
        error: 'Car not found',
      });
    }
    return res.status(200).json({ status: 200, data: car });
  },

  async getCars(req, res) {
    let car;
    const { status } = req.query;
    let { min_price, max_price } = req.query;
    min_price = parseFloat(min_price);
    max_price = parseFloat(max_price);

    if (status && min_price && max_price) {
      car = cars.filter((result) => {
        const { price } = result;
        return (result.status === status) && (price >= min_price) && (price <= max_price);
      });
    } else if (status) {
      car = cars.filter((result) => {
        return result.status === status;
      });
    } else {
      car = cars;
    }
    if (car.length === 0) {
      return res.status(404).json({
        status: 404,
        error: 'Car not found',
      });
    }
    return res.status(200).json({ status: 200, data: car });
  },

  async deleteCar(req, res) {
    if (req.userData.id !== 3) {
      return res.status(401).json({
        status: 401,
        error: 'Not permited to complete this action',
      });
    }
    const index = cars.findIndex(result => result.id === parseFloat(req.params.car_id));
    cars.splice(index, 1);
    return res.status(200).json({
      status: 200,
      data: 'Car Ad successfully deleted',
    });
  },
};

export default CarsControllers;
