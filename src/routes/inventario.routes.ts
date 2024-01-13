import { Router } from 'express';
import { tokenValidation } from '../middlewares/verifyToken';
import * as controller from '../controllers/inventario.controllers';

export const inventoryRouter = Router();

inventoryRouter.get('/all-inventory', tokenValidation, controller.getAllInventory);
inventoryRouter.get('/low-stock', tokenValidation, controller.getLowStock);
inventoryRouter.get('/history/:_id', tokenValidation, controller.getInventoryHistory);
inventoryRouter.post('/add-new-inventory', tokenValidation, controller.AddInventory);
inventoryRouter.post(
	'/remove-from-inventory',
	tokenValidation,
	controller.removeFromInventory
);
inventoryRouter.post('/add-to-inventory', tokenValidation, controller.addToInventory);
inventoryRouter.post(
	'/change-minumum-stock',
	tokenValidation,
	controller.changeMinumumUnitsRequired
);
inventoryRouter.put('/edit-inventory-data', tokenValidation, controller.editInventory);
inventoryRouter.delete(
	'/delete-inventory/:_id',
	tokenValidation,
	controller.deleteInventory
);
