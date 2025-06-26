import express from 'express';
import { populatePaymentController } from '../controller/populatePayment.controller';
import { getPaymentDataOfDifferentMonthsController } from '../controller/getPaymentDataFromDifferentMonth.controller';

const router = express.Router();

router.post('/populate-payment', populatePaymentController);
router.get(
  '/get-income-data-of-different-months',
  getPaymentDataOfDifferentMonthsController
);

export const paymentRouter = router;
