import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { myStripe } from '../../../../config/stripe/stripe.config';

export const testSavedCardPaymentController = myControllerHandler(
  async (req, res) => {
    const { email } = req.body;
    const userData = await userModel.findOne({ email });
    if (!email) {
      throw new Error('user does not exist with this email');
    }
    const stripePaymentMethodId = userData?.stripePaymentMethodId as string;
    const stripeCustomerId = userData?.stripeCustomerId as string;
    const stripePaymentIntent = await myStripe.paymentIntents.create({
      amount: 500,
      currency: 'usd',
      customer: stripeCustomerId,
      payment_method: stripePaymentMethodId,
      off_session: true,
      confirm: true,
    });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: { stripePaymentIntent },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
