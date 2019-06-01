
/* eslint-disable array-callback-return */
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
    const car = cars.find(result => result.id === car_id);
    if (!car) {
      return res.status(404).json({
        status: 404,
        error: 'Invalid car selected',
      });
    }
    const order = { id, buyer, created_on, car_id, price, status };
    orders.push(order);
    const data = { id, car_id, created_on, status, price: car.price, price_offered: price };
    return res.status(201).json({ status: 201, data });
  }

  static updateOrderPrice(req, res) {
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
  }
}
