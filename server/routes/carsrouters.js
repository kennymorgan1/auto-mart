import express from 'express';
import CarsController from '../controllers/carscontroller';
import authenticate from '../auth/check-auth';
import carValidation from '../validators/carsvalidator';

const router = express.Router();

router.post('/', authenticate, carValidation.postCar, CarsController.postCar);
router.patch('/:car_id/status', authenticate, carValidation.updateCarStatus, CarsController.updateCarStatus);

export default router;
