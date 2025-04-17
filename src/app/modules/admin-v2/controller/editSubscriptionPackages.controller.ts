import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { subscriptionPackageModel } from '../../subscription_packages/model/subscriptionPackages.model';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const editSubscriptionPackagesController = myControllerHandler(
  async (req, res) => {
    const { name, price, duration, details, id } = req.body;
    const updateData: any = {};
    if (name) {
      updateData.name = name;
    }
    if (price) {
      updateData.price = price;
    }
    if (duration) {
      updateData.duration = duration;
    }
    if (details) {
      updateData.details = details;
    }

    await subscriptionPackageModel.findOneAndUpdate({ id }, updateData);

    const myResponse = {
      message: 'Packages Updated Successfully',
      success: true,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
