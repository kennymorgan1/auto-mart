import express from 'express';
import OrdersController from '../controllers/ordercontroller';
import authenticate from '../auth/check-auth';
import orderValidation from '../validators/ordervalidator';

const router = express.Router();

router.post('/', authenticate, orderValidation.purchaseOrder, OrdersController.PurchaseOrder);

export default router;
