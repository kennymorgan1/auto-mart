/* eslint-disable consistent-return */
import Joi from 'joi';

export default class CarValidation {
  static postCar(req, res, next) {
    const schema = Joi.object().keys({
      state: Joi.string().valid('new', 'used').required()
        .error(new Error('State should be valid either new or used')),
      status: Joi.string().valid('sold', 'available').required()
        .error(new Error('status uld be valid either sold or available')),
      price: Joi.number().integer().required()
        .error(new Error('Invalid price supplied')),
      manufacturer: Joi.string().min(3).max(20).required()
        .error(new Error('manufacturer should be between 3 and 20 characters')),
      model: Joi.string().min(3).max(20).required()
        .error(new Error('model should be between 3 and 20 characters')),
      body_type: Joi.string().min(3).max(20).required()
        .error(new Error('body type must be between 3 to 20 characters')),
    });

    // eslint-disable-next-line consistent-return
    Joi.validate(req.body, schema, (error) => {
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.message,
        });
      }
      next();
    });
  }

  static updateCarStatus(req, res, next) {
    const schema = Joi.object().keys({
      status: Joi.string().valid('sold', 'available').required()
        .error(new Error('status uld be valid either sold or available')),
    });

    Joi.validate(req.body, schema, (error) => {
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.message,
        });
      }
      next();
    });
  }

  static updateCarPrice(req, res, next) {
    const schema = Joi.object().keys({
      price: Joi.number().integer().required()
        .error(new Error('Invalid price supplied')),
    });

    Joi.validate(req.body, schema, (error) => {
      if (error) {
        return res.status(400).json({
          status: 400,
          error: error.message,
        });
      }
      next();
    });
  }
}
