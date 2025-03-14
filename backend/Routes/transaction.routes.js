import { Router } from "express";
import * as transactionController from '../Controllers/transaction.controller.js'


const router=Router();



router.get('/getall',transactionController.getAllTransactionController);


export default router;