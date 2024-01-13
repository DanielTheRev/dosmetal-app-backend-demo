import { Router } from 'express';
import * as controller from '../controllers/clientes.controllers';

export const ClientRouter = Router();

ClientRouter.get('/all-clients', controller.getAllClients);
ClientRouter.post('/add-new-client', controller.addNewClient);
ClientRouter.patch('/edit-client', controller.editClient);
ClientRouter.delete('/delete-client/:_id', controller.deleteClient);
