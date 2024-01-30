import { Router } from 'express';
import * as ctrl from '../controllers/auth.controller';
import { tokenValidation } from '../middlewares/verifyToken';

export const AuthRouter = Router();

AuthRouter.post('/registerUser', tokenValidation, ctrl.registerUser);
AuthRouter.post('/verify', ctrl.VerifyUserToken);
AuthRouter.post('/logIn', ctrl.LogIn);
AuthRouter.get('/getUserProfile', tokenValidation, ctrl.GetUserProfile);
