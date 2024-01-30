import { Router } from 'express';
import * as ctrl from '../controllers/presupuestos.controller';
import { tokenValidation } from '../middlewares/verifyToken';

export const PresupuestosRouter = Router();

PresupuestosRouter.use(tokenValidation);
PresupuestosRouter.get('/getPresupuestos', ctrl.getPresupuestos);
PresupuestosRouter.get('/getPresupuesto/:_id', ctrl.getPresupuesto);
PresupuestosRouter.post('/createPresupuesto', ctrl.cretePresupuesto);
PresupuestosRouter.post('/savePdfDocument', ctrl.SavePDFPresupuesto);
PresupuestosRouter.post('/saveChangesOnPresupuesto', ctrl.saveChangesOnPresupuesto);
PresupuestosRouter.delete('/deletePresupuesto/:_id', ctrl.deletePresupuesto);
