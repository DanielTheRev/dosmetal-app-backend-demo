import { Router } from 'express';
import {
	addHomeBanner,
	editHomeBannerDescription,
	editHomeBannerImage,
	getHomeBanner,
	getHomeBanners
} from '../controllers/home-banner.controller';

export const HomeBannerRouter = Router();

HomeBannerRouter.get('/getHomeBanners', getHomeBanners);
HomeBannerRouter.post('/getHomeBanner', getHomeBanner);
HomeBannerRouter.post('/addHomeBanner', addHomeBanner);
HomeBannerRouter.patch('/editHomeBannerDescription', editHomeBannerDescription);
HomeBannerRouter.patch('/editHomeBannerImg', editHomeBannerImage);
