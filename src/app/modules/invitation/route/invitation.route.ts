import express from 'express';
import { acceptOrRejectInvitationController } from '../controller/acceptOrRejectInvitation.controller';

const invitationRouter = express.Router();

invitationRouter.post('/action', acceptOrRejectInvitationController);

export { invitationRouter };
