import { model, Schema } from 'mongoose';
import { Presentacion } from '../interface/presentacion.interface';

const PresentacionSchema = new Schema<Presentacion>(
	{
		description: String,
		images: {
			type: [
				{
					imgRef: {}
				}
			],
			maxlength: 2,
			default: [
				{
					imgRef: null
				},
				{
					imgRef: null
				},
				{
					imgRef: null
				}
			]
		}
	},
	{
		versionKey: false,
		timestamps: true
	}
);

export const PresentacionModel = model<Presentacion>('Presentacion', PresentacionSchema);
