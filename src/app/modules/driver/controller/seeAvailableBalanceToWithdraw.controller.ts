import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../../trip/model/trip.model';
import { generateRandomTripDataVersion3 } from '../../../../utils/others/generateRandomTripVersion3';

export const seeAvailableBalanceToWithdrawController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const tripData = await TripModel.find({
      driverId: userData.id,
      isPaymentReceivedByDriver: false,
    });

    let totalPriceToWithDraw = 0;
    for (let i = 0; i < tripData.length; i++) {
      const singleTripData = tripData[i];
      totalPriceToWithDraw =
        totalPriceToWithDraw + singleTripData.shareOfDriver;
    }

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Review Given Successfully',
      data: {
        totalPriceToWithDraw: totalPriceToWithDraw,
      },
    });
  }
);
//  for (let i = 0; i < 50; i++) {
//       const singleTripData = generateRandomTripDataVersion3();
//       await TripModel.create({
//         type: 'booked',
//         driverId: userData.id,
//         customerId: singleTripData.customerId,
//         totalPrice: singleTripData.totalPrice,
//         shareOfDriver: singleTripData.shareOfDriver,
//         shareOfApp: singleTripData.shareOfApp,
//         carType: singleTripData.carType,
//         pickupTime: singleTripData.pickupTime,
//         dropoffTime: singleTripData.dropoffTime,
//         estimatedTimeInSeconds: singleTripData.estimatedTimeInSeconds,
//         distanceInKilometers: singleTripData.distanceInKilometers,
//         paymentStatus: 'paid',
//         paymentIdInOwnDatabase: singleTripData.paymentIdInOwnDatabase,
//         routePolyline: singleTripData.routePolyline,
//         isMarkedCompletedByUser: true,
//         isMarkedCompleteByDriver: true,
//         pickupLocation: singleTripData.pickupLocation,
//         dropoffLocation: singleTripData.dropoffLocation,
//       });
//     }
