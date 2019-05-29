import express from 'express';
import AuthController from '../controllers/authcontroller';
import AuthValidation from '../validators/authvalidator';

const router = express.Router();

router.post('/register', AuthValidation.createUser, AuthController.createUser);

router.post('/login', AuthController.loginUser);

export default router;