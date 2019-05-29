/* eslint-disable camelcase */
import cars from '../model/carsdata';
import users from '../model/authdata';

export default class CarsControllers {
  static postCar(req, res) {
    // eslint-disable-next-line object-curly-newline
    const { state, price, manufacturer, model, body_type } = req.body;
    const car = {
      id: cars.length + 1,
      owner: req.userData.id,
      email: req.userData.email,
      created_on: new Date(),
      state,
      status: 'available',
      price,
      manufacturer,
      model,
      body_type,
    };
    users.push(car);
    return res.status(201).json({ status: 201, data: car });
  }
}
