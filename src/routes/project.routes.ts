import { Router } from 'express';
import * as ctrl from '../controllers/project.controller';
import { tokenValidation } from '../middlewares/verifyToken';

export const ProjectRouter = Router();

ProjectRouter.get('/getSections', ctrl.getSections);
ProjectRouter.post('/getSectionData', ctrl.getSectionData);
ProjectRouter.post('/addSection', tokenValidation, ctrl.addSections);
ProjectRouter.post('/getProject', ctrl.getProject);
ProjectRouter.post('/addProject', tokenValidation, ctrl.addProject);
ProjectRouter.patch('/updateProject', tokenValidation, ctrl.updateProject);
ProjectRouter.delete(
	'/deleteProject/:sectionID/:projectID',
	tokenValidation,
	ctrl.deleteProjectFromSection
);
ProjectRouter.post('/deleteImage', tokenValidation, ctrl.deleteImgFromProject);
