import Joi from 'joi';

export default class UserValidation {
  static createUser(req, res, next) {
    const schema = Joi.object().keys({
      first_name: Joi.string().min(3).max(100).required()
        .error(new Error('First name must be between 5 to 100 digits')),
      last_name: Joi.string().min(3).max(100).required()
        .error(new Error('Last name must be between 5 to 100 digits')),
      email: Joi.string().email().required().lowercase()
        .error(new Error('Incorrect email supplied')),
      password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).min(7).required()
        .error(new Error('Password must be longer than 7 characters')),
      confirmPassword: Joi.valid(Joi.ref('password')).required().error(new Error('Password does not match')),
      address: Joi.string().min(7).max(150).error(new Error('Address must be between 7 to 150 characters')),
      is_admin: Joi.boolean().error(new Error('is_admin must ba a valid boolean')),
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

  static resetPassword(req, res, next) {
    const schema = Joi.object().keys({
      newPassword: Joi.string().min(7).required().error(new Error('Password must be longer than 7 characters')),
      confirmNewPassword: Joi.valid(Joi.ref('newPassword')).required().error(new Error('Password does not match')),
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
