import { Schema } from 'mongoose';

export interface IInventoryHistory {
	date: number;
	in: boolean;
	detail: string;
}

export const InventoryHistorySchema = new Schema<IInventoryHistory>({
	date: Number,
	detail: String,
	in: Boolean
});
