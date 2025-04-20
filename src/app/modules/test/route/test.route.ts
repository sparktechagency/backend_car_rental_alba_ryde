import express from 'express';
import { testController } from '../controller/test.controller';
import { makeDummyUserController } from '../controller/generateDummyUser.controller';

const testRouter = express.Router();

testRouter.post('/', testController);
testRouter.get('/create-dummy-user', makeDummyUserController);

export { testRouter };
