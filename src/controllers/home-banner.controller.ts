import { Request, Response } from 'express';
import { homeBannerModel } from '../models/home-banner.model';
import { UploadImage } from '../services/cloudinary.service';

export const getHomeBanners = async (req: Request, res: Response) => {
	const HomeBanners = await homeBannerModel.find();
	return res.json(HomeBanners);
};

export const getHomeBanner = async (req: Request, res: Response) => {
	const DTO = req.body as { banner: string };
	const HomeBanner = await homeBannerModel.findOne({ banner: DTO.banner });
	return res.json(HomeBanner);
};

export const addHomeBanner = async (req: Request, res: Response) => {
	const DTO = req.body as { banner: string; description: string };
	const files = req.files as any[];
	const newBanner = new homeBannerModel(DTO);

	// if (files!.length > 0) {
	// 	const imgRef = await UploadImage(files[0], DTO.banner, 'homeBanners');
	// 	newBanner.imgRef = imgRef;
	// }

	const bannerSaved = await newBanner.save();

	return res.json({ status: 'Banner Guardado', bannerSaved });
};

export const editHomeBannerDescription = async (req: Request, res: Response) => {
	const DTO = req.body as { _id: string; description: string };
	const banner = await homeBannerModel.findById(DTO._id);
	if (!banner) return res.json({ status: false, message: 'parece que ese banner no existe' });

	banner.description = DTO.description;
	const bannerSaved = await banner.save();
	setTimeout(() => {
		res.json({ status: true, bannerSaved, message: 'banner actualizado' });
	}, 5000);
};

export const editHomeBannerImage = async (req: Request, res: Response) => {
	const files = req.files as any[];
	const DTO = req.body as { _id: string; banner: string; imgID: string };

	const banner = await homeBannerModel.findOne({ _id: DTO._id, banner: DTO.banner });
	if (!banner) return res.json({ status: 'banner no encontrado' });
	if (files.length <= 0) res.json({ status: 'no hay imagenes para cambiar' });

	const imgRef = await UploadImage(files!.at(0), DTO.banner, `homeBanners/${DTO.banner}`);
	const banner_image_idx = banner.images.findIndex((e) => e._id?.toString() === DTO.imgID);

	banner.images.at(banner_image_idx)!.imgRef = imgRef;
	const bannerSaved = await banner.save();
	setTimeout(() => {
		return res.json({ status: 'imagen actualizada', bannerSaved });
	}, 2000);
};
