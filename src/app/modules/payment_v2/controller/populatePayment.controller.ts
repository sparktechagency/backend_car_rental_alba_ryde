import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { generateNewRandomPayment } from '../../../../helpers_v2/payment/generateRandomPayment';
import { PaymentModel } from '../model/payment.model';

export const populatePaymentController = myControllerHandler(
  async (req, res) => {
    for (let i = 0; i < 100; i++) {
      const paymentData = generateNewRandomPayment();
      const paymentData2 = await PaymentModel.create(paymentData);
    }

    const myResponse = {
      message: 'payment populated successful',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
