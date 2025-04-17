import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { subscriptionPackageModel } from '../../subscription_packages/model/subscriptionPackages.model';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const addSubscriptionPackagesController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
    const { name, price, duration, details } = req.body;
    await subscriptionPackageModel.create({
      name,
      price: Number(price),
      duration,
      details,
    });
    const myResponse = {
      message: 'Subscription Package Created Successfull',
      success: true,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
