import { Router } from 'express';
import { tokenValidation } from '../middlewares/verifyToken';
import * as ctrl from '../controllers/inventario.controllers';

export const inventoryRouter = Router();

inventoryRouter.use(tokenValidation);
inventoryRouter.get('/all-inventory', ctrl.getAllInventory);
inventoryRouter.get('/low-stock', ctrl.getLowStock);
inventoryRouter.get('/history/:_id', ctrl.getInventoryHistory);
inventoryRouter.post('/add-new-inventory', ctrl.AddInventory);
inventoryRouter.post('/remove-from-inventory', ctrl.removeFromInventory);
inventoryRouter.post('/add-to-inventory', ctrl.addToInventory);
inventoryRouter.post('/change-minumum-stock', ctrl.changeMinumumUnitsRequired);
inventoryRouter.put('/edit-inventory-data', ctrl.editInventory);
inventoryRouter.delete('/delete-inventory/:_id', ctrl.deleteInventory);
