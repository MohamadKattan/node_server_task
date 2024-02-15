import { Router } from "express";
import { checkSchema, body } from 'express-validator';
import validatorSrv from '../utilities/validations.js';
import ordersController from "../controllers/orders_controller.js";


const ordersRouter = Router();

ordersRouter.post('/api/addNewOrder', checkSchema(validatorSrv.validOrder), ordersController.addNewOrder);

ordersRouter.get('/api/getOrders', ordersController.getALLOrdersOneUser);

export default ordersRouter;