import express from 'express';
import { getNearestDriverAccordingToCoordinatesController } from '../controller/getNearestDriver.controller';
import { getNearestDriverAccordingToCoordinatesWithPaginationController } from '../controller/getNearestDriverWithPagination.controller';
import { changeAllDriverLocationToNearestController } from '../controller/changeAllDriversLocationToNearest.controller';
import { addBankAccountController } from '../controller/addBankAccount.controller';
import { seeAvailableBalanceToWithdrawController } from '../controller/seeAvailableBalanceToWithdraw.controller';
import { sendRequestToWithdrawController } from '../controller/sendRequestToWithdraw.controller';

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
router.post('/add-bank-account', addBankAccountController);
router.get(
  '/see-available-balance-to-withdraw',
  seeAvailableBalanceToWithdrawController
);
router.post('/send-request-to-withdraw', sendRequestToWithdrawController);

export const driverRouter = router;
