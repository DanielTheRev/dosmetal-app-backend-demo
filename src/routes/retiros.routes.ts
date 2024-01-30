import { Router } from 'express';

import * as ctrl from '../controllers/retiros.controllers';
import { tokenValidation } from '../middlewares/verifyToken';

export const RetirosRoutes = Router();

RetirosRoutes.use(tokenValidation);
RetirosRoutes.get('/getMonths', ctrl.getMonths);
RetirosRoutes.get('/getToday', ctrl.getToday);
RetirosRoutes.post('/especificDay', ctrl.getEspecificDayRetiros);
