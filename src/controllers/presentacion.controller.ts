import { Request, Response } from 'express';
import { PresentacionModel } from '../models/presentacion.model';
import { UploadImage } from '../services/cloudinary.service';
import { NewsModel } from '../models/news.model';
import { sectionModel } from '../models/section.mode';

export const getInfoPresentacion = async (req: Request, res: Response) => {
	const info = await PresentacionModel.find();
	const news = await NewsModel.find();
	const allSections = await sectionModel.find();
	const only_last_project = allSections.map((section) => {
		return {
			_id: section._id,
			section: section.section,
			last_project: section.data.find((e) => e.isLastProject)
		};
	});

	return res.json({ Presentacion: info[0], NewsList: news, last_projects: only_last_project });
};

export const createInfoPresentacion = async (req: Request, res: Response) => {
	const DTO = req.body as { description: string };

	try {
		const Info = new PresentacionModel({
			description: DTO.description
		});
		await Info.save();
		return res.json({ message: 'Terminado', Info });
	} catch (error) {
		return res.status(500).json({ message: 'Error' });
	}
};

export const updatePresentacionDescription = async (req: Request, res: Response) => {
	const DTO = req.body as { _id: string; description: string };
	const Banner = await PresentacionModel.findById(DTO._id);
	if (!Banner) return res.json({ message: 'Parece que no existe ese banner' });
	try {
		Banner.description = DTO.description;
		await Banner.save();
		return res.json({ message: 'Descripcion actualizada' });
	} catch (error) {
		return res.status(500).json({ message: 'Error al guardar documento' });
	}
};

export const updatePresentacionImage = async (req: Request, res: Response) => {
	const DTO = req.body as { _id: string; imgID: string };
	const files = req.files as any[];
	const file = files[0];
	if (!file) return res.status(500).json({ message: 'No se encontro imagen' });

	try {
		const imgSaved = await UploadImage(file, DTO.imgID, '/Presentacion/images');
		const banner = await PresentacionModel.findById(DTO._id);

		if (!banner) return res.status(500).json({ message: 'No se encontro banner' });

		const img_to_replace_idx = banner.images.findIndex((e) => e._id?.toString() === DTO.imgID);
		banner.images[img_to_replace_idx].imgRef = imgSaved;

		const banner_updated_saved = await banner.save();
		return res.json({
			message: 'Actualizado correctamente',
			banner_updated: banner_updated_saved
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Algo se rompio durante el preceso' });
	}
};
