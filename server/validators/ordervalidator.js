import Joi from 'joi';

export default class OrderValidation {
  static purchaseOrder(req, res, next) {
    const schema = Joi.object().keys({
      status: Joi.string().valid('pending', 'accepted', 'rejected').required()
        .error(new Error('status uld be valid either pending, accepted or rejected')),
      price: Joi.number().integer().required()
        .error(new Error('Invalid price supplied')),
      car_id: Joi.number().integer().required()
        .error(new Error('Invalid car supplied')),
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
}
