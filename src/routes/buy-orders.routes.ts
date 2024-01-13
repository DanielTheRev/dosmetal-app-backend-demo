import { Router } from 'express';
import * as Controller from '../controllers/buy-orders.controllers';

export const BuyOrdersRoutes = Router();

BuyOrdersRoutes.get('/all-orders', Controller.GetAllOrders);
BuyOrdersRoutes.post('/create-order', Controller.CreateBuyOrder);
BuyOrdersRoutes.delete('/delete/:id', Controller.DeleteBuyOrder);
