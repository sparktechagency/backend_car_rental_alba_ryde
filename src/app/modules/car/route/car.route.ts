import express from 'express';
import { addCarController } from '../controller/addCar.controller';

const router = express.Router();

router.post('/add-car', addCarController);

export const carRouter = router;
