import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';
import { myStripe } from '../../../../config/stripe/stripe.config';
import { PaymentModel } from '../../payment_v2/model/payment.model';

export const markTripCompletedByUserController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const { tripId } = req.body;
    const tripData = await TripModel.findOne({
      id: tripId,
      customerId: userData.id,
      type: 'booked',
      status: 'accepted',
    });
    if (!tripData) {
      throw new Error('invalid trip id');
    }

    const stripePaymentIntent = await myStripe.paymentIntents.create({
      amount: tripData.totalPrice * 100,
      currency: 'usd',
      customer: userData.stripeCustomerId,
      payment_method: userData.stripePaymentMethodId,
      off_session: true,
      confirm: true,
    });
    const paymentData = await PaymentModel.create({
      paymentIntentId: stripePaymentIntent.id,
      customerId: userData.stripeCustomerId,
      paymentMethodId: userData.stripePaymentMethodId,
      amount: stripePaymentIntent.amount,
      amountReceived: stripePaymentIntent.amount_received,
      currency: stripePaymentIntent.currency,
      status: stripePaymentIntent.status,
      captureMethod: stripePaymentIntent.capture_method,
      confirmationMethod: stripePaymentIntent.confirmation_method,
      latestChargeId: stripePaymentIntent.latest_charge,
      clientSecret: stripePaymentIntent.client_secret,
      description: stripePaymentIntent.description,
      receiptEmail: stripePaymentIntent.receipt_email,
      setupFutureUsage: stripePaymentIntent.setup_future_usage,
      metadata: stripePaymentIntent.metadata,
    });

    tripData.paymentIdInOwnDatabase = paymentData.id;
    tripData.isMarkedCompletedByUser = true;
    tripData.status = 'completed';
    tripData.paymentStatus = 'paid';
    await tripData.save();

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: { tripData },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
