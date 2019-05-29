/* eslint-disable object-curly-newline */
/* eslint-disable camelcase */
import orders from '../model/orderdata';
import cars from '../model/carsdata';

export default class OrderController {
  static PurchaseOrder(req, res) {
    const { car_id, price, status } = req.body;
    const id = orders.length + 1;
    const buyer = req.userData.id;
    const created_on = new Date();
    const isValidCar = orders.findIndex(result => result.id === car_id);
    if (isValidCar === -1) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid car selected',
      });
    }
    const car = cars[isValidCar];
    const order = {
      id,
      buyer,
      created_on,
      car_id,
      price,
      status,
    };
    orders.push(order);
    const data = { id, car_id, created_on, status, price: car.price, price_offered: price };
    return res.status(201).json({ status: 201, data });
  }
}
