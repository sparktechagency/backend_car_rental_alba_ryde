import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { subscriptionPackageModel } from '../model/subscriptionPackages.model';

export const getSubscriptionPackagesController = myControllerHandler(
  async (req, res) => {
    const packagesData = await subscriptionPackageModel.find();

    const myResponse = {
      message: 'Subscription Packages Fetched Successfully',
      success: true,
      data: packagesData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
