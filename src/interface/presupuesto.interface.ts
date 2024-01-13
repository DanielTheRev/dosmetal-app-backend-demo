import { Schema } from 'mongoose';

export interface IPresupuesto {
	_id?: string;
	Cliente: Schema.Types.ObjectId;
	TipoPresupuesto: string;
	IvaIncluido: string;
	Obra: string;
	PresupuestoNum: number;
	FormaDePago: string;
	PlazoDeEntrega: string;
	LugarDeEntrega: string;
	ValidezDeOferta: string;
	Nota: string;
	Items: IItemPresupuesto[];
	SubTotal: number;
	IVA21: number;
	Total: number;
	Fecha: number;
	Estado: string;
}

export interface IItemPresupuesto {
	Descripcion: string;
	Precio: string;
}
