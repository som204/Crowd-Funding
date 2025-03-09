import { Router } from "express";
import * as projectController from '../Controllers/project.controller.js'
import  {authorization} from '../Middleware/auth.middleware.js'


const route = Router();

route.post('/create',authorization,projectController.createProjectController)
route.get('/all',authorization,projectController.getAllProjectController)
route.get('/:id',authorization,projectController.getProjectByIdController)

export default route;