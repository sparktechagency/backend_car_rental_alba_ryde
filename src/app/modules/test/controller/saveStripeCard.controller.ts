import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';

export const step2StripePaymentSaveController = myControllerHandler(
  async (req, res) => {
    const { stripePaymentMethodId, stripeCustomerId, stripeEmail } = req.body;
    console.log({ stripePaymentMethodId, stripeCustomerId, stripeEmail });
    const userData = await userModel.findOne({ email: stripeEmail });
    if (!userData) {
      throw new Error('user does not exist with this email');
    }
    userData.stripeCustomerId = stripeCustomerId;
    userData.stripePaymentMethodId = stripePaymentMethodId;
    await userData.save();
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        userData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
