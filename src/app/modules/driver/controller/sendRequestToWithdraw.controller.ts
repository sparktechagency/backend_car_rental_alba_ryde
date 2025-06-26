import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../../trip/model/trip.model';

export const sendRequestToWithdrawController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const tripData = await TripModel.find({
      driverId: userData.id,
      paymentStatus: 'paid',
      isPaymentReceivedByDriver: false,
    });

    if (tripData.length <= 0) {
      throw new Error(
        'you have no available trip to withdraw money from. invalid request.'
      );
    }

    for (let i = 0; i < tripData.length; i++) {
      const singleTripData = tripData[i];
      singleTripData.isRequestedByDriverToWithdraw = true;
      await singleTripData.save();
    }
    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Request to withdraw sent successful',
      data: {},
    });
  }
);
