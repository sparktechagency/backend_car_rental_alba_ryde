import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';
import { myStripe } from '../../../../config/stripe/stripe.config';

export const requestForBookingController2 = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const { id } = userData;
    const { carType, totalPrice } = req.body;
    const tripData = await TripModel.findOne({
      customerId: id,
      carType: carType,
      totalPrice: totalPrice,
      type: 'user_search',
    }).sort({ createdAt: -1 });
    if (!tripData) {
      throw new Error('trip does not exist');
    }

    // check if user has card

    if (!userData.stripeCustomerId || !userData.stripePaymentMethodId) {
      throw new Error(
        'plz add card to your account. card does not exist for this user'
      );
    }
    // check if this card is valid
    await myStripe.setupIntents.create({
      customer: userData.stripeCustomerId,
      payment_method: userData.stripePaymentMethodId,
      confirm: true,
      usage: 'off_session',
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // to avoid redirect-based payments if you want server-side only
      },
    });

    tripData.type = 'user_request';

    const newTripData = await tripData.save();

    const myResponse = {
      message: 'Trip Request Successful',
      success: true,
      data: newTripData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
