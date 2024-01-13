import { Router } from 'express';
import * as ProjectController from '../controllers/project.controller';
export const ProjectRouter = Router();

ProjectRouter.get('/getSections', ProjectController.getSections);
ProjectRouter.post('/getSectionData', ProjectController.getSectionData);
ProjectRouter.post('/addSection', ProjectController.addSections);
ProjectRouter.post('/getProject', ProjectController.getProject);
ProjectRouter.post('/addProject', ProjectController.addProject);
ProjectRouter.patch('/updateProject', ProjectController.updateProject);
ProjectRouter.delete(
	'/deleteProject/:sectionID/:projectID',
	ProjectController.deleteProjectFromSection
);
ProjectRouter.post('/deleteImage', ProjectController.deleteImgFromProject);
