import { Request, Response } from 'express';
import { IPresupuesto } from '../interface/presupuesto.interface';
import { ClienteModel } from '../models/cliente.model';
import { PresupuestoModel } from '../models/presupuesto.model';
import { SoConn } from '../webSocket';
import { UploadImage } from '../services/cloudinary.service';

export const getPresupuestos = async (req: Request, res: Response) => {
	const Presupuestos = await PresupuestoModel.find().populate({
		path: 'Cliente',
		select: ['nombre', 'cuit', 'email', 'telefono']
	});
	return res.json(Presupuestos);
};

export const getPresupuesto = async (req: Request, res: Response) => {
	const presupuesto = await PresupuestoModel.findById(req.params._id);
	if (!presupuesto)
		return res.status(404).json({ message: 'Error al obtener presupuesto o no existe' });
	return res.json(presupuesto);
};

export const cretePresupuesto = async (req: Request, res: Response) => {
	const presupuesto = req.body as IPresupuesto;
	const Cliente = await ClienteModel.findById(presupuesto.Cliente);

	const newPresupuesto = new PresupuestoModel(presupuesto);
	if (!Cliente) return res.status(500).json({ message: 'No se encuentra cliente o no existe' });
	newPresupuesto.PresupuestoNum = await getLastPresupuestoNumber();
	try {
		const presupuestoSaved = await (
			await newPresupuesto.save()
		).populate({
			path: 'Cliente',
			select: ['nombre', 'cuit', 'email', 'telefono']
		});
		Cliente.presupuestos.push(presupuestoSaved._id);
		await Cliente.save();
		SoConn.emit('[PRESUPUESTOS] New Presupuesto', presupuestoSaved);
		SoConn.emit('[CLIENTS] Presupuesto added', {
			clientID: presupuesto.Cliente,
			presupuestoID: presupuestoSaved._id
		});
		res.json({
			presupuesto: presupuestoSaved,
			message: 'Presupuesto creado con exito'
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Error al crear presupuesto' });
	}
};

export const saveChangesOnPresupuesto = async (req: Request, res: Response) => {
	const PresupuestoDTO = req.body;
	console.log('Presupuesto recibido');
	console.log(PresupuestoDTO);
	const Presupuesto = await PresupuestoModel.findByIdAndUpdate(
		PresupuestoDTO._id,
		PresupuestoDTO,
		{ new: true }
	).populate({
		path: 'Cliente',
		select: ['nombre', 'cuit', 'email', 'telefono']
	});
	if (!Presupuesto) return res.status(500).json({ message: 'No se encontro presupuesto' });

	try {
		const presupuestoUpdated = await Presupuesto.save();
		console.log('PRESUPUESTO MODIFICADO');
		console.log(presupuestoUpdated);
		return res.json({
			presupuestoUpdated,
			message: 'Presupuesto modificado correctamente'
		});
	} catch (error) {
		return res.status(500).json({ message: 'Error al guardar presupuesto' });
	}
};

export const SavePDFPresupuesto = async (req: Request, res: Response) => {
	if (!req.files) return res.json({ status: 'fail' });
	const files = req.files as any;
	const data = JSON.parse(req.body.data) as { documentName: string; presupuestoID: string };
	const file = files[0];
	console.log(data);
	const fileUpload = await UploadImage(file, '', '/pdf-documents');
	return res.json({ status: 'probando' });
};

export const deletePresupuesto = async (req: Request, res: Response) => {
	console.log(req.params);
	const presupuestoID = req.params._id;
	const presupuesto = await PresupuestoModel.findById(presupuestoID);
	if (!presupuesto) return res.status(404).json({ message: 'No existe documento a eliminar' });
	try {
		const cliente = await ClienteModel.findById(presupuesto.Cliente);
		cliente!.presupuestos = cliente!.presupuestos.filter((f) => presupuestoID !== f.toString());
		const newPresupuesto = await cliente!.save();
		presupuesto.deleteOne();
		SoConn.emit('[PRESUPUESTOS] Presupuesto Deleted', { presupuestoID });
		SoConn.emit('[CLIENTS] Presupuesto deleted', {
			ClientID: cliente!._id,
			PresupuestoID: presupuestoID
		});
		res.json({ message: 'Presupuesto borrado con exito' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ messge: 'Error al eliminar documento' });
	}
};

/* helpers */
const getLastPresupuestoNumber = async () => {
	const ClientePresupuestos = await PresupuestoModel.find();
	if (ClientePresupuestos.length <= 0) return 1000;
	ClientePresupuestos.sort((a, b) => {
		if (a.PresupuestoNum > b.PresupuestoNum) return 1;
		return -1;
	});
	const lastNumber = ClientePresupuestos.at(-1)!.PresupuestoNum;
	console.log(`Ultimo numero de presupuesto ${lastNumber}`);
	const count = lastNumber + 1;
	return count;
};
