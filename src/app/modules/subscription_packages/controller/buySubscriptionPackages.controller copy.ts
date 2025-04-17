import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { subscriptionPackageModel } from '../model/subscriptionPackages.model';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { myStripe } from '../../../../config/stripe/stripe.config';
import { PaymentModel } from '../../payment_v2/model/payment.model';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const buySubscriptionPackagesController = myControllerHandler(
  async (req, res) => {
    // await checkIsBanned2(req)
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { packageId, stripeToken } = req.body;
    const { email } = authData;
    const userData = await userModelOfMantled.findOne({ email });
    const packageDetails = await subscriptionPackageModel.findOne({
      id: packageId,
    });
    if (!userData) {
      throw new Error('User does not existss');
    }
    if (!packageDetails) {
      throw new Error('This Package does not exists');
    }
    const amountToCharge = packageDetails.price * 100;
    const charge = await myStripe.charges.create({
      amount: amountToCharge,
      currency: 'usd',
      source: stripeToken,
      description: `${userData.fullName} buying ${packageDetails.name}`,
      metadata: {
        userId: userData.id,
        packageId: packageDetails.id,
      },
    });
    if (charge.status === 'failed') {
      throw new Error('Subscription Purchased Failed Failed');
    }

    const {
      id,
      amount,
      currency,
      payment_method,
      status,
      payment_method_details,
      receipt_url,
    } = charge;

    PaymentModel.create({
      transactionId: id,
      packageId: packageDetails.id,
      userId: userData.id,
      amount,
      currency,
      paymentMethod: payment_method,
      status,
      cardBrand: payment_method_details?.card?.brand,
      last4: payment_method_details?.card?.last4,
      receiptUrl: receipt_url,
    });

    const myResponse = {
      message: 'Subscription Packages Fetched Successfully',
      success: true,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
