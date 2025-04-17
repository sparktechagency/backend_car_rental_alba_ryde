import express from 'express';
import { getPropertyDataFromZooplaController } from '../controller/getPropertyDataFromZoopla.controller';

const router = express.Router();

router.post(
  '/get-property-data-from-zoopla',
  getPropertyDataFromZooplaController
);

export const propertyRouter = router;
