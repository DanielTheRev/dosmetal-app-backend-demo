import { model, Schema } from 'mongoose';
import { HomeBannerType } from '../interface/home-banner.interface';

const homeBannerSchema = new Schema<HomeBannerType>(
	{
		banner: String,
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
	},
	{
		versionKey: false,
		timestamps: true
	}
);

export const homeBannerModel = model<HomeBannerType>('HomeBanner', homeBannerSchema);
