import { Router } from 'express';

import * as RetirosController from '../controllers/retiros.controllers';

export const RetirosRoutes = Router();

RetirosRoutes.get('/getMonths', RetirosController.getMonths);
RetirosRoutes.get('/getToday', RetirosController.getToday);
RetirosRoutes.post('/especificDay', RetirosController.getEspecificDayRetiros);
