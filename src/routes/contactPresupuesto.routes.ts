import { Router } from 'express';
import * as ctrl from '../controllers/contactPresupuesto.controller';
import { tokenValidation } from '../middlewares/verifyToken';

export const ContactPresupuestoRouter = Router();

ContactPresupuestoRouter.get(
	'/getAllContactPresupuesto',
	tokenValidation,
	ctrl.getAllContactPrespuesto
);
ContactPresupuestoRouter.post('/newContactPrespuesto', ctrl.createContactPresupuesto);
