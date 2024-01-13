import { Schema, model } from 'mongoose';
import { IPresupuesto } from '../interface/presupuesto.interface';

const PresupuestoSchema = new Schema<IPresupuesto>({
	Cliente: { type: Schema.Types.ObjectId, ref: 'Cliente' },
	TipoPresupuesto: String,
	IvaIncluido: String,
	Obra: String,
	PresupuestoNum: Number,
	FormaDePago: String,
	PlazoDeEntrega: String,
	LugarDeEntrega: String,
	ValidezDeOferta: String,
	Nota: String,
	Items: [
		{
			Descripcion: String,
			Precio: String
		}
	],
	SubTotal: Number,
	IVA21: Number,
	Total: Number,
	Fecha: Number,
	Estado: String
});

export const PresupuestoModel = model<IPresupuesto>('Presupuesto', PresupuestoSchema);
