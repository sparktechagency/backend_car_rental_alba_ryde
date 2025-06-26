import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { TripModel } from '../model/trip.model';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { PERCENTAGE_OF_CANCELLATION_FEE } from '../../../../data/environmentVariables';
import { myStripe } from '../../../../config/stripe/stripe.config';
import { PaymentModel } from '../../payment_v2/model/payment.model';

export const cancelTripBookingsController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const { tripId } = req.body;

    // Fetch the trip data based on the conditions
    const tripData = await TripModel.findOne({
      id: tripId,
      customerId: userData.id,
      type: { $in: ['user_request', 'booked'] },
      status: { $nin: ['completed', 'cancelled'] },
    });

    // If no trip is found, throw an error
    if (!tripData) {
      throw new Error('invalid trip id');
    }

    // Initialize the cancellation price to 0
    let cancellationPrice = 0;

    // Check if the trip status is "accepted" (only charge fee if status is accepted)
    if (tripData.status === 'accepted') {
      cancellationPrice =
        tripData.totalPrice * (PERCENTAGE_OF_CANCELLATION_FEE / 100);

      // Create a Stripe payment intent for the cancellation fee
      const stripePaymentIntent = await myStripe.paymentIntents.create({
        amount: cancellationPrice * 100, // Amount in cents
        currency: 'usd',
        customer: userData.stripeCustomerId,
        payment_method: userData.stripePaymentMethodId,
        off_session: true,
        confirm: true,
      });

      // Create a new payment record in your database
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

      // Update the trip's payment status and relevant data
      tripData.paymentIdInOwnDatabase = paymentData.id;
      tripData.paymentStatus = 'paid';
    }

    // Regardless of the status, cancel the trip
    tripData.status = 'cancelled';
    tripData.cancelledBy = 'user';

    // If cancellation fee was charged, store the fee
    if (cancellationPrice > 0) {
      tripData.pricePaidForCancellation = cancellationPrice;
    }

    // Save the updated trip data
    await tripData.save();

    // Send the response back to the user
    const myResponse = {
      message: 'Trip cancelled successfully',
      success: true,
      data: {
        tripData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
