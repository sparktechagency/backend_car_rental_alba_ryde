import express from 'express';
import { getNearestDriverAccordingToCoordinatesController } from '../controller/getNearestDriver.controller';

const router = express.Router();

router.post(
  '/get-nearest-driver-according-to-coordinates',
  getNearestDriverAccordingToCoordinatesController
);

export const driverRouter = router;
