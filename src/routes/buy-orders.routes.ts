import { Router } from 'express';
import * as Controller from '../controllers/buy-orders.controllers';
import { tokenValidation } from '../middlewares/verifyToken';

export const BuyOrdersRoutes = Router();

BuyOrdersRoutes.use(tokenValidation);
BuyOrdersRoutes.get('/all-orders', Controller.GetAllOrders);
BuyOrdersRoutes.post('/create-order', Controller.CreateBuyOrder);
BuyOrdersRoutes.delete('/delete/:id', Controller.DeleteBuyOrder);
