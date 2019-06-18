
/* eslint-disable array-callback-return */
/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
import dotenv from 'dotenv';
import { Client } from 'pg';

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
    const { order_id } = req.params;
    // eslint-disable-next-line arrow-body-style
    const validOrder = 'SELECT * FROM Orders WHERE id = $1 AND buyer = $2';
    const updateOrder = `UPDATE Orders SET price = '${price}' WHERE id = ${order_id} RETURNING *`;
    try {
      const { rows } = await client.query(validOrder, [order_id, req.userData.id]);
      if (!rows[0]) {
        return res.status(404).json({ status: 404, error: 'Invalid order selected' });
      }
      const result = await client.query(updateOrder);
      const data = result.rows[0];
      return res.status(200).json({ status: 200, data });
    } catch (error) {
      return res.status(500).json({ status: 500, error });
    }
  },
};

export default OrderController;
