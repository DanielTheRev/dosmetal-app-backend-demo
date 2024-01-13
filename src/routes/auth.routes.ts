import { Router } from 'express';
import * as UserControllers from '../controllers/auth.controller';
import { tokenValidation } from '../middlewares/verifyToken';

export const AuthRouter = Router();

AuthRouter.post('/registerUser', UserControllers.registerUser);
AuthRouter.post('/verify', UserControllers.VerifyUserToken);
AuthRouter.post('/logIn', UserControllers.LogIn);
AuthRouter.get('/getUserProfile', tokenValidation, UserControllers.GetUserProfile);
