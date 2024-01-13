import { Schema, model } from 'mongoose';
import { ITool } from '../interface/herramienta.interface';

const ToolSchema = new Schema<ITool>(
	{
		Nombre: String,
		Marca: String,
		imgRef: {},
		Stock: [
			{
				Fecha_Compra: String,
				Cantidad: Number,
				Estado: String,
				Ubicacion: String
			}
		]
	},
	{ versionKey: false }
);

export const ToolModel = model<ITool>('Tool', ToolSchema);
