import { Request, Response } from 'express';
import { ContactPrespuesto } from '../interface/contactPrespuesto.interface';
import { ContactPresupuestoModel } from '../models/contactPresupuesto.model';
import { SoConn } from '../webSocket';

export const getAllContactPrespuesto = async (req: Request, res: Response) => {
	const contactPrespuestos = await ContactPresupuestoModel.find();

	return res.json(contactPrespuestos);
};

export const createContactPresupuesto = async (req: Request, res: Response) => {
	const DTO = req.body as ContactPrespuesto;
	const newContactPrespuesto = new ContactPresupuestoModel(DTO);

	const contactPresupuestoSaved = await newContactPrespuesto.save();
	SoConn.emit('new clientPresupuesto', contactPresupuestoSaved);
	return res.json({
		message: 'Muchas gracias, nos comunicaremos a la brevedad con usted'
	});
};
