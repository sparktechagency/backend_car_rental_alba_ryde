import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { myStripe } from '../../../../config/stripe/stripe.config';

export const step1StripePaymentSaveController = myControllerHandler(
  async (req, res) => {
    const { email } = req.body;

    const stripeCustomer = await myStripe.customers.create({
      email: email,
    });
    console.log(stripeCustomer);
    const stripeSetupIntent = await myStripe.setupIntents.create({
      customer: stripeCustomer.id,
      payment_method_types: ['card'],
    });
    const data = {
      stripeSetupIntentClientSecret: stripeSetupIntent.client_secret,
      stripeCustomerId: stripeCustomer.id,
      email: email,
    };

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        data,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
