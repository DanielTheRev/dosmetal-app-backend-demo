import { v2 as cloudinary } from 'cloudinary';
import DataURIParser from 'datauri/parser';
import { Express } from 'express';
import path from 'path';

cloudinary.config({
	cloud_name: process.env.CL_NAME,
	api_key: process.env.CL_API_KEY,
	api_secret: process.env.CL_API_SECRET
});

export const UploadImage = async (
	file: Express.Multer.File,
	id: string,
	folder: string
) => {
	const parser = new DataURIParser();
	const extName = path.extname(file.originalname).toString();
	const file64 = parser.format(extName, file.buffer);

	const img_uploaded = await cloudinary.uploader.upload(file64.content!, {
		public_id: id,
		overwrite: true,
		folder: folder
	});

	return img_uploaded;
};

export const DeleteImage = async (publicID: string) => {
	return cloudinary.uploader.destroy(publicID);
};
