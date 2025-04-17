import express from 'express';
import { myController } from './controller.template';

const router = express.Router();

router.post('/sign-in', myController);

export const myRouter = router;
