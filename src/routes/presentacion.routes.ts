import { Router } from 'express';
import * as presentacionCtrl from '../controllers/presentacion.controller';
import * as newsCtrl from '../controllers/news.controller';
import { tokenValidation } from '../middlewares/verifyToken';

export const PresentacionRouter = Router();

PresentacionRouter.get('/getInfoPresentacion', presentacionCtrl.getInfoPresentacion);
PresentacionRouter.post('/create', tokenValidation, presentacionCtrl.createInfoPresentacion);
PresentacionRouter.post(
	'/updateDescription',
	tokenValidation,
	presentacionCtrl.updatePresentacionDescription
);
PresentacionRouter.post('/updateImage', tokenValidation, presentacionCtrl.updatePresentacionImage);
PresentacionRouter.get('/getNews', newsCtrl.getNews);
PresentacionRouter.post('/createNews', tokenValidation, newsCtrl.createNews);
PresentacionRouter.post('/updateNewsData', tokenValidation, newsCtrl.updateNewsData);
PresentacionRouter.post('/updateNewsImage', tokenValidation, newsCtrl.updateNewsImage);
