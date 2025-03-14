import { Router } from "express";
import * as projectController from '../Controllers/project.controller.js'
import  {authorization} from '../Middleware/auth.middleware.js'


const route = Router();

route.post('/create',authorization,projectController.createProjectController)
route.get('/all',projectController.getAllProjectController)
route.get('/creatorid/:id',authorization,projectController.getByCreatorIdController)
route.get('/projectid/:id',authorization,projectController.getByProjectIdController)


export default route;