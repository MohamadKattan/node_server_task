import { Router } from "express";
import userRouter from "./user_router.js";
import ordersRouter from "./orders_router.js";


const allRouters = Router();

allRouters.use(userRouter);
allRouters.use(ordersRouter);

export default allRouters;
