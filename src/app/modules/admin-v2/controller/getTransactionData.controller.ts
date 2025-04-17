import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { subscriptionPackageModel } from '../../subscription_packages/model/subscriptionPackages.model';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { PaymentModel } from '../../payment_v2/model/payment.model';
import { JWT_SECRET_KEY } from '../../../../data/environmentVariables';

export const getTransactionDataController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, JWT_SECRET_KEY, userModelOfMantled);
    const { from, to } = req.query as any;
    const startIndex = parseInt(from, 10) || 0;
    const endIndex = parseInt(to, 10) || 0;
    const limit = endIndex - startIndex;
    if (limit < 0) {
      throw new Error(
        'Invalid range: "to" should be greater than or equal to "from".'
      );
    }
    const paymentData = await PaymentModel.find().skip(startIndex).limit(limit);
    const myResponse = {
      message: 'Packages Updated Successfully',
      success: true,
      data: paymentData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
