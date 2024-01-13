import { Router } from 'express';
import * as Controller from '../controllers/contactPresupuesto.controller';
export const ContactPresupuestoRouter = Router();

ContactPresupuestoRouter.get(
	'/getAllContactPresupuesto',
	Controller.getAllContactPrespuesto
);
ContactPresupuestoRouter.post(
	'/newContactPrespuesto',
	Controller.createContactPresupuesto
);
