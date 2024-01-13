import { Request, Response } from 'express';
import { BuyOrderModel } from '../models/buy-order.model';

export const GetAllOrders = async (req: Request, res: Response) => {
	const BuyOrders = await BuyOrderModel.find();

	return res.json({
		isEmpty: BuyOrders.length <= 0,
		data: BuyOrders
	});
};
const GetOrdersCount = async () => {
	const BuyOrders = await BuyOrderModel.find();

	if (!BuyOrders) return 1000;

	return BuyOrders.at(-1) ? BuyOrders.at(-1)!.OrderNo + 1 : 1000;
};

export const CreateBuyOrder = async (req: Request, res: Response) => {
	const DTO = req.body;

	const NewBuyOrder = new BuyOrderModel(DTO);
	NewBuyOrder.OrderNo = await GetOrdersCount();

	try {
		const NewBuyOrderSaved = await NewBuyOrder.save();

		return res.json({
			order: NewBuyOrderSaved
		});
	} catch (error) {
		return res.status(500).json({
			message: 'No se pudo guardar la nueva orden'
		});
	}
};

export const DeleteBuyOrder = async (req: Request, res: Response) => {
	const id = req.params.id;
	try {
		await BuyOrderModel.deleteOne({ _id: id })
		return res.json({
			message: 'Orden de compra eliminada con exito'
		});
	} catch (error) {
		return res.json({
			message: 'Error al eliminar orden de compra'
		});
	}
};
