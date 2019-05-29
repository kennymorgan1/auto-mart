import express from 'express';
import AuthController from '../controllers/authcontroller';

const router = express.Router();

router.post('/', AuthController.createUser);

export default router;
