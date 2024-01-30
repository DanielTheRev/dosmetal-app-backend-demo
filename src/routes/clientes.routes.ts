import { Router } from 'express';
import * as ctrl from '../controllers/clientes.controllers';
import { tokenValidation } from '../middlewares/verifyToken';

export const ClientRouter = Router();

ClientRouter.use(tokenValidation);
ClientRouter.get('/all-clients', ctrl.getAllClients);
ClientRouter.post('/add-new-client', ctrl.addNewClient);
ClientRouter.patch('/edit-client', ctrl.editClient);
ClientRouter.delete('/delete-client/:_id', ctrl.deleteClient);
