import { Router } from 'express';

import * as ToolController from '../controllers/tools.controller';

export const ToolsRouter = Router();

ToolsRouter.get('/get-tools', ToolController.GetTools);
ToolsRouter.post('/add-new-tool', ToolController.AddNewTool);
ToolsRouter.post('/update-tool', ToolController.UpdateTool);
ToolsRouter.delete('/delete-tool/:_id', ToolController.DeleteTool);
// HerramientaRouter.put('/update-tool/:_id')
