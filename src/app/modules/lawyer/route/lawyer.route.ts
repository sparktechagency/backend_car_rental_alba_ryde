import express from 'express';
import { addLawyerController } from '../controller/addLawyer.controller';
import { getLawyerDataController } from '../controller/getDataOfLawyers.controller';
import { inviteLawyerController } from '../controller/inviteLawyer.controller';

const lawyerRouter = express.Router();

lawyerRouter.post('/add-lawyer', addLawyerController);
lawyerRouter.get('/get-lawyer-data', getLawyerDataController);
lawyerRouter.post('/invite-lawyer', inviteLawyerController);

export { lawyerRouter };
