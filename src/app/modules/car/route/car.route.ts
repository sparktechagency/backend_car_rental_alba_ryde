import express from 'express';
import { addCarController } from '../controller/addCar.controller';
import { populateCarController } from '../controller/populateCar.controller';

const router = express.Router();

router.post('/add-car', addCarController);
router.post('/populate-car', populateCarController);

export const carRouter = router;
