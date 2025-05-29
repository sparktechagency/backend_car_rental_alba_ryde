import express from 'express';
import { getNearestDriverAccordingToCoordinatesController } from '../controller/getNearestDriver.controller';
import { getNearestDriverAccordingToCoordinatesWithPaginationController } from '../controller/getNearestDriverWithPagination.controller';
import { changeAllDriverLocationToNearestController } from '../controller/changeAllDriversLocationToNearest.controller';

const router = express.Router();

router.post(
  '/get-nearest-driver-according-to-coordinates',
  getNearestDriverAccordingToCoordinatesController
);
router.get(
  '/get-nearest-driver-according-to-coordinates-with-pagination',
  getNearestDriverAccordingToCoordinatesWithPaginationController
);
router.post(
  '/change-all-driver-location-to-nearest',
  changeAllDriverLocationToNearestController
);

export const driverRouter = router;
