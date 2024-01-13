import { Schema, model } from 'mongoose';
import { News } from '../interface/news.interface';

const NewsSchema = new Schema<News>({
	title: String,
	description: String,
	images: {
		type: [
			{
				imgRef: {}
			}
		],
		maxlength: 2,
		default: [
			{
				imgRef: null
			},
			{
				imgRef: null
			},
			{
				imgRef: null
			}
		]
	}
});

export const NewsModel = model<News>('New', NewsSchema);
