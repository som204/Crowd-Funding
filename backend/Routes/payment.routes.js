import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import  {authorization} from '../Middleware/auth.middleware.js'

const router = Router();


router.post('/create-order',authorization,paymentController.createOrder);
router.post('/verify-payment',authorization,paymentController.verifyPayment);


export default router;