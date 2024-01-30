import { Router } from 'express';
import * as ctrl from '../controllers/home-banner.controller';
import { tokenValidation } from '../middlewares/verifyToken';

export const HomeBannerRouter = Router();

HomeBannerRouter.get('/getHomeBanners', ctrl.getHomeBanners);
HomeBannerRouter.post('/getHomeBanner', ctrl.getHomeBanner);
HomeBannerRouter.post('/addHomeBanner', tokenValidation, ctrl.addHomeBanner);
HomeBannerRouter.patch(
	'/editHomeBannerDescription',
	tokenValidation,
	ctrl.editHomeBannerDescription
);
HomeBannerRouter.patch('/editHomeBannerImg', tokenValidation, ctrl.editHomeBannerImage);
