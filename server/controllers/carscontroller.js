/* eslint-disable arrow-body-style */
/* eslint-disable camelcase */
import cars from '../model/carsdata';

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
    cars.push(car);
    return res.status(201).json({ status: 201, data: car });
  }

  static updateCarStatus(req, res) {
    const { status } = req.body;

    const car = cars.find((result) => {
      return (result.id === parseFloat(req.params.car_id) && (result.owner === req.userData.id));
    });
    if (!car) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid car selected',
      });
    }
    car.status = status;
    return res.status(200).json({ status: 200, data: car });
  }

  static updateCarPrice(req, res) {
    const { price } = req.body;

    const car = cars.find((result) => {
      return (result.id === parseFloat(req.params.car_id) && (result.owner === req.userData.id));
    });
    if (!car) {
      return res.status(400).json({
        status: 400,
        error: 'Invalid car selected',
      });
    }
    car.price = price;
    return res.status(200).json({ status: 200, data: car });
  }
}
