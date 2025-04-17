import express from 'express';
import { addCollaboratorController } from '../controller/addCollaborator.controller';

const collaborationRouter = express.Router();

collaborationRouter.post('/add', addCollaboratorController);

export { collaborationRouter };
