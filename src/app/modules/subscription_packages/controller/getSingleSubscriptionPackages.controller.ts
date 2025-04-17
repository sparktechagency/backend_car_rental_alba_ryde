import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { subscriptionPackageModel } from '../model/subscriptionPackages.model';

export const getSingleSubscriptionPackagesController = myControllerHandler(
  async (req, res) => {
    const { id } = req.params;
    const packageData = await subscriptionPackageModel.findOne({ id });

    const myResponse = {
      message: 'Subscription Packages Fetched Successfully',
      success: true,
      data: packageData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
