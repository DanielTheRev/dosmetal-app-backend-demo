import { Request, Response } from 'express';
import { NewsModel } from '../models/news.model';
import { UploadImage } from '../services/cloudinary.service';

export const getNews = async (req: Request, res: Response) => {
	const data = await NewsModel.find();

	return res.json(data);
};

export const createNews = async (req: Request, res: Response) => {
	const DTO = req.body as { title: string; description: string };
	const images = [{ imgRef: null }, { imgRef: null }, { imgRef: null }];
	try {
		const NewsCreated = new NewsModel({ ...DTO, images });

		const NewsSaved = await NewsCreated.save();
		return res.json({ message: 'Creado con exito', NewsSaved });
	} catch (error) {
		return res.status(500).json({ message: 'Error al crear nueva noticia' });
	}
};

export const updateNewsData = async (req: Request, res: Response) => {
	const data = req.body as { property: string; value: 'description' | 'title'; _id: string };
	const news_target = (await NewsModel.findById(data._id)) as any; // ptm🥲;
	if (!news_target) return res.status(404).json({ status: 'No se encontro elemento' });

	try {
		news_target[data.property] = data.value;
		await news_target.save();
		return res.json({ status: 'Actualizado correctamente' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ status: 'Error al actualizar elemento' });
	}
};

export const updateNewsImage = async (req: Request, res: Response) => {
	const files = req.files as any[];
	const DTO = req.body as { _id: string; imgID: string };

	const News = await NewsModel.findById(DTO._id);
	if (!News) return res.status(500).json({ message: 'Parece que no existe' });
	if (files.length <= 0) res.json({ status: 'no hay imagenes para cambiar' });

	try {
		const imgRef = await UploadImage(files!.at(0), DTO.imgID, `Presentacion/${News.title.trim()}`);
		const News_image_idx = News.images.findIndex((e) => e._id?.toString() === DTO.imgID);

		News.images.at(News_image_idx)!.imgRef = imgRef;
		const NewsSaved = await News.save();

		return res.json({ message: 'Actualizado con existo', NewsUpdated: NewsSaved });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ message: 'Error' });
	}
};
