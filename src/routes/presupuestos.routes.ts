import { Router } from 'express';
import * as controller from '../controllers/presupuestos.controller';

export const PresupuestosRouter = Router();

PresupuestosRouter.get('/getPresupuestos', controller.getPresupuestos);
PresupuestosRouter.get('/getPresupuesto/:_id', controller.getPresupuesto);
PresupuestosRouter.post('/createPresupuesto', controller.cretePresupuesto);
PresupuestosRouter.post('/savePdfDocument', controller.SavePDFPresupuesto);
PresupuestosRouter.post('/saveChangesOnPresupuesto', controller.saveChangesOnPresupuesto);
PresupuestosRouter.delete('/deletePresupuesto/:_id', controller.deletePresupuesto);
