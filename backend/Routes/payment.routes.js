import { Router } from 'express';
import * as paymentController from '../Controllers/payment.controller.js';
import  {authorization} from '../Middleware/auth.middleware.js'

const router = Router();


router.post('/create-order',authorization,paymentController.createOrder);
router.post("/create-contact", paymentController.createContactController);
router.post("/create-fund-account", paymentController.createFundAccountController);
router.post("/create-payout", paymentController.createPayoutController);


export default router;