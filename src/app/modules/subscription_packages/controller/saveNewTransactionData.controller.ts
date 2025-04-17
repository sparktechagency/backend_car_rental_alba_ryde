import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { subscriptionPackageModel } from '../model/subscriptionPackages.model';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { PaymentModel } from '../../payment_v2/model/payment.model';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const saveNewSubscriptionPackagesController = myControllerHandler(
  async (req, res) => {
    // await checkIsBanned2(req);
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const {
      packageId,
      transactionId,
      amount,
      currency,
      paymentMethod,
      status,
      cardBrand,
      last4,
      receiptUrl,
    } = req.body;

    if (!transactionId || !amount || !currency || !paymentMethod || !status) {
      throw new Error('Invalid payment details provided');
    }

    const { email } = authData;
    const userData = await userModelOfMantled.findOne({ email });
    if (!userData) {
      throw new Error('User does not exist');
    }

    const packageDetails = await subscriptionPackageModel.findOne({
      id: packageId,
    });
    if (!packageDetails) {
      throw new Error('This package does not exist');
    }

    await PaymentModel.create({
      transactionId,
      packageId,
      userId: userData.id,
      amount,
      currency,
      paymentMethod,
      status,
      cardBrand,
      last4,
      receiptUrl,
    });

    res.status(StatusCodes.OK).json({
      message: 'Payment recorded successfully',
      success: true,
    });
  }
);
