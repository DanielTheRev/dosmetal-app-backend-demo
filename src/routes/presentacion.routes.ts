import { Router } from 'express';
import {
	createInfoPresentacion,
	getInfoPresentacion,
	updatePresentacionDescription,
	updatePresentacionImage
} from '../controllers/presentacion.controller';
import {
	createNews,
	getNews,
	updateNewsData,
	updateNewsImage
} from '../controllers/news.controller';

export const PresentacionRouter = Router();

PresentacionRouter.get('/getInfoPresentacion', getInfoPresentacion);
PresentacionRouter.post('/create', createInfoPresentacion);
PresentacionRouter.post('/updateDescription', updatePresentacionDescription);
PresentacionRouter.post('/updateImage', updatePresentacionImage);
PresentacionRouter.get('/getNews', getNews);
PresentacionRouter.post('/createNews', createNews);
PresentacionRouter.post('/updateNewsData', updateNewsData);
PresentacionRouter.post('/updateNewsImage', updateNewsImage);
