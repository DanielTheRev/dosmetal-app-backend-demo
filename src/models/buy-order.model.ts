import { Schema, model } from 'mongoose';
import { IBuyOrder } from '../interface/buy-order.interface';

const BuyOrderSchema = new Schema<IBuyOrder>({
	CompanyName: String,
	Date: String,
	OrderNo: Number,
	OrderTo: {
		ClientName: String,
		Adress: String,
		Telephone: String
	},
	Products: [
		{
			Product: String,
			Amount: String
		}
	]
});

export const BuyOrderModel = model<IBuyOrder>('BuyOrder', BuyOrderSchema);
