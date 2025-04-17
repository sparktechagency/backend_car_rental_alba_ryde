import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { subscriptionPackageModel } from '../../subscription_packages/model/subscriptionPackages.model';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { PaymentModel } from '../../payment_v2/model/payment.model';
import { JWT_SECRET_KEY } from '../../../../data/environmentVariables';

export const getSingleTransactionDataController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, JWT_SECRET_KEY, userModelOfMantled);
    const { id } = req.params;
    const paymentData = await PaymentModel.findOne({ id });
    const myResponse = {
      message: 'Packages Updated Successfully',
      success: true,
      data: paymentData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
