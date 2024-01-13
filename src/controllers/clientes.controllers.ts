import { Request, Response } from 'express';
import { ClienteModel } from '../models/cliente.model';
import { PresupuestoModel } from '../models/presupuesto.model';
import { SoConn } from '../webSocket';
import { ICliente } from '../interface/clientes.interface';

export const getAllClients = async (req: Request, res: Response) => {
	const clients = await ClienteModel.find();
	return res.json(clients);
};

export const addNewClient = async (req: Request, res: Response) => {
	const newClient = new ClienteModel(req.body);

	try {
		newClient.save();
		return res.json({ newClient });
	} catch (error) {
		return res.status(500).json({ message: 'error al guardar cliente en la base de datos' });
	}
};

export const editClient = async (req: Request, res: Response) => {
	const NewClientData = req.body as ICliente;
	try {
		await ClienteModel.findOneAndUpdate({ _id: NewClientData._id }, NewClientData, {
			new: true
		});

		return res.json({ message: 'Cliente actualizado con exito' });
	} catch (error) {
		console.log('Error al actualizar Cliente Err:');
		console.log(error);
		return res.status(500).json({ message: 'Error al guardar cambios en cliente' });
	}
};

export const deleteClient = async (req: Request, res: Response) => {
	const clientID = req.params._id;
	const client = await ClienteModel.findById(clientID);
	if (!client) return res.status(500).json({ message: 'Error al eliminar cliente' });

	try {
		for await (const id of client.presupuestos) {
			await PresupuestoModel.deleteOne({ _id: id });
			SoConn.emit('[PRESUPUESTOS] Presupuesto Deleted', { presupuestoID: id });
		}
		await client.deleteOne();
		return res.json({ message: 'Cliente eliminado' });
	} catch (error) {
		return res.status(500).json({ message: 'Error al eliminar cliente' });
	}
};
