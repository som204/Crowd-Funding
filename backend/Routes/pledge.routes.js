import { Router } from 'express';
import * as pledgeController from '../Controllers/pledge.controller.js';
import { authorization } from '../Middleware/auth.middleware.js';

const router = Router();


router.post('/create', authorization,pledgeController.createPledgeController);


router.get('/projectid/:id', authorization,pledgeController.getByProjectIdController);


router.get('/backerid/:id', authorization,pledgeController.getByBackerIdController);



export default router;