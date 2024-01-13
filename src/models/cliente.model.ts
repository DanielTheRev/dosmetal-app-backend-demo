import { model, Schema } from 'mongoose';
import { ICliente } from '../interface/clientes.interface';
import { PresupuestoModel } from './presupuesto.model';

const ClienteSchema = new Schema<ICliente>({
	nombre: String,
	cuit: String,
	email: String,
	telefono: String,
	presupuestos: [{
		type: Schema.Types.ObjectId,
		ref: PresupuestoModel
	}],
	Obras: []
});

export const ClienteModel = model<ICliente>('Cliente', ClienteSchema);
