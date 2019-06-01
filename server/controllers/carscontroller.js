
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
      return res.status(404).json({
        status: 404,
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
      return res.status(404).json({
        status: 404,
        error: 'Invalid car selected',
      });
    }
    car.price = price;
    return res.status(200).json({ status: 200, data: car });
  }

  static getOneCar(req, res) {
    const car = cars.find(result => result.id === parseFloat(req.params.car_id));
    if (!car) {
      return res.status(404).json({
        status: 404,
        error: 'Car not found',
      });
    }
    return res.status(200).json({ status: 200, data: car });
  }

  static getCars(req, res) {
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
  }

  static deleteCar(req, res) {
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
  }
}
