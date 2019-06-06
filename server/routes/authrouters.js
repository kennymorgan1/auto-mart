import express from 'express';
import AuthController from '../controllers/authcontroller';
import AuthValidation from '../validators/authvalidator';

const router = express.Router();

router.post('/signup', AuthValidation.createUser, AuthController.createUser);

router.post('/signin', AuthController.loginUser);

router.put('/forget_password', AuthController.forgetPassword);


router.put('/reset_password/:user_id', AuthValidation.resetPassword, AuthController.resetPassword);

export default router;
