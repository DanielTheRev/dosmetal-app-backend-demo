import { model, Schema } from 'mongoose';
import { ContactPrespuesto } from '../interface/contactPrespuesto.interface';

const ContactPresupuestoSchema = new Schema<ContactPrespuesto>(
	{
		name: String,
		lastName: String,
		email: String,
		tel: String,
		message: String
	},
	{
		versionKey: false,
		timestamps: true
	}
);

export const ContactPresupuestoModel = model<ContactPrespuesto>(
	'ContactPrespuesto',
	ContactPresupuestoSchema
);
