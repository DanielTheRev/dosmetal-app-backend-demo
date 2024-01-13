import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
config();

if (!process.env.SECRET_KEY) {
	throw new Error('no secret key for jwt');
}

cloudinary.config({
	cloud_name: process.env.CL_NAME,
	api_key: process.env.CL_API_KEY,
	api_secret: process.env.CL_API_SECRET
});

export const Cloudinary = cloudinary;
export const INITIAL_CONFIG = {
	MONGO_DB: {
		path: process.env.DB_URI || 'mongodb://127.0.0.1:27017/dos-metal-backend-demo',
		production: Boolean(process.env.DB_URI)
	},
	SECRET_KEY: process.env.SECRET_KEY
};
