import { Router } from "express";
import * as userController from '../Controllers/user.controller.js'
import {authorization} from '../Middleware/auth.middleware.js'


const route = Router();


route.post('/register',userController.createUserController);
route.post('/login',userController.loginController);
route.get('/logout',authorization,userController.logoutController);







export default route;