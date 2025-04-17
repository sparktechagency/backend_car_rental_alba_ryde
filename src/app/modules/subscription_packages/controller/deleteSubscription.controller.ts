import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { subscriptionPackageModel } from '../model/subscriptionPackages.model';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const deleteSubscriptionController = myControllerHandler(
  async (req, res) => {
    // await checkIsBanned2(req);
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { id } = req.params;

    const subscriptionData = await subscriptionPackageModel.findOne({ id });

    if (!subscriptionData) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'This subscription does not exists' });
    }

    await subscriptionData.deleteOne();

    const myResponse = {
      message: 'Subscription Deleted Successfull',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
