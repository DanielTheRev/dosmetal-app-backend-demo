import { model, Schema } from 'mongoose';
import { ContactCard } from '../interface/contactCard.interface';

const ContactCardSchema = new Schema<ContactCard>(
	{
		Telefono: [String],
		Facebook: String,
		Instagram: String
	},
	{
		versionKey: false,
		timestamps: true
	}
);

export const ContactCardModel = model<ContactCard>('ContactCard', ContactCardSchema);
