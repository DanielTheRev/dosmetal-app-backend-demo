import { Request, Response } from 'express';
import { ITool } from '../interface/herramienta.interface';
import { ToolModel } from '../models/tools.model';
import { DeleteImage, UploadImage } from '../services/cloudinary.service';

export const GetTools = async (req: Request, res: Response) => {
	const AllTools = await ToolModel.find();
	return res.json({ data: AllTools, isEmpty: AllTools.length <= 0 });
};

export const AddNewTool = async (req: Request, res: Response) => {
	const newToolDTO = JSON.parse(req.body.newTool) as ITool;
	const files = req.files as any;
	const file = files[0];

	try {
		const NewTool = new ToolModel(newToolDTO);
		if (file) {
			const img_uploaded = await UploadImage(file, NewTool._id!, 'tools-images');
			NewTool.imgRef = img_uploaded;
		}
		const NewToolSaved = await NewTool.save();
		return res.json({
			message: 'Herramienta agregada con exito',
			data: NewToolSaved
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al guardar herramienta' });
	}
};

export const UpdateTool = async (req: Request, res: Response) => {
	const toolDTO = JSON.parse(req.body.data) as any;

	const tool = await ToolModel.findById(toolDTO._id);
	if (!tool) return res.status(500).json({ message: 'Herramienta no encontrada' });

	const imgFile = req.file;
	if (imgFile) {
		const imgRef = await UploadImage(imgFile, tool._id!, 'tools-images');
		toolDTO.imgRef = imgRef;
	}
	console.log(toolDTO);
	const toolUpdated = await ToolModel.findOneAndUpdate(toolDTO._id, toolDTO, {
		new: true
	});
	return res.json({ toolUpdated });
};

export const DeleteTool = async (req: Request, res: Response) => {
	const id = req.params._id;
	const tool = await ToolModel.findById(id);
	if (!tool) return res.status(404).json({ message: 'No se encuentra la herramienta' });
	try {
		if (typeof tool.imgRef !== 'string' && tool.imgRef.public_id) {
			await DeleteImage(tool.imgRef.public_id);
		}
		tool.deleteOne();

		return res.json({ message: 'Herramienta eliminada' });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error al eliminar herramienta' });
	}
};
