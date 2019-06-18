
/* eslint-disable array-callback-return */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
import dotenv from 'dotenv';
import { Client } from 'pg';
import orders from '../model/orderdata';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});
client.connect().then(() => console.log('connected')).catch(err => console.log(err));

const OrderController = {
  async PurchaseOrder(req, res) {
    const validCar = 'SELECT * FROM Cars WHERE id = $1';
    const { car_id, price, status } = req.body;
    const buyer = req.userData.id;
    const price_offered = price;
    const created_on = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const orderQuery = `INSERT INTO Orders(car_id, price, price_offered, buyer, created_on, status) VALUES ('${car_id}', '${price}', '${price_offered}', '${buyer}', '${created_on}', '${status}') RETURNING *`;
    try {
      const { rows } = await client.query(validCar, [car_id]);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: 'Invalid car selected' });
      }
      const result = await client.query(orderQuery);
      // eslint-disable-next-line object-curly-newline
      const data = result.rows[0];
      return res.status(201).json({ status: 201, data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 500, error });
    }
  },

  async updateOrderPrice(req, res) {
    const { price } = req.body;
    // eslint-disable-next-line arrow-body-style
    const order = orders.find((result) => {
      return (result.id === parseFloat(req.params.order_id)) && (result.buyer === req.userData.id);
    });
    if (!order) {
      return res.status(404).json({
        status: 404,
        error: 'Invalid order selected',
      });
    }
    const data = {
      id: order.id,
      car_id: order.car_id,
      status: order.status,
      old_price_offered: order.price,
      new_price_offered: price,
    };
    order.price = price;
    return res.status(200).json({ status: 200, data });
  },
};

export default OrderController;
