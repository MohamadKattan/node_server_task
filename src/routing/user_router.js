import { Router } from "express";
import { checkSchema, body } from 'express-validator';
import userControllerMethods from "../controllers/user_controller.js";
import validatorSrv from "../utilities/validations.js";

const userRouter = Router();

userRouter.get('/', (req, res) => {
    req.session.visited = true;
    userControllerMethods.connectToDataBASE(req, res);
});

userRouter.get('/api/readQ', userControllerMethods.readQueryFromString);

userRouter.get('/api/validQ', checkSchema(validatorSrv.validateQuery), userControllerMethods.validatUserQuery);

userRouter.post('/api/signup', checkSchema(validatorSrv.validateCreateNewUser), userControllerMethods.signUpNewUser);

userRouter.post('/api/logIn', checkSchema(validatorSrv.validateLogInUser), userControllerMethods.logInUser);

userRouter.get('/api/profile', userControllerMethods.getProfileUser);

userRouter.post('/api/updateUser', validatorSrv.validateUpdateUser(), userControllerMethods.updateUserInfo);

userRouter.post('/api/sginOut', userControllerMethods.siginOut);

userRouter.delete('/api/deleteUser', userControllerMethods.deleteUser);


// to do add send verification email + forget pass word  + google signUp + facebook

export default userRouter;