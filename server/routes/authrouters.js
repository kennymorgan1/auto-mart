import express from 'express';
import AuthController from '../controllers/authcontroller';
import AuthValidation from '../validators/authvalidator';

const router = express.Router();

router.post('/signup', AuthValidation.createUser, AuthController.createUser);

router.post('/signin', AuthController.loginUser);

export default router;
