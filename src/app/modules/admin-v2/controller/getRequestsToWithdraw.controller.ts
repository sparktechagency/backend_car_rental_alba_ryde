import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { TripModel } from '../../trip/model/trip.model';
import { userModel } from '../../auth_v2/model/user.model';
import { TempModel } from '../model/invoiceRequest.model';

export const getRequestsToWithdrawController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin3(req);

    const trips = await TripModel.find({
      paymentStatus: 'paid',
      isRequestedByDriverToWithdraw: true,
    }).sort({ createdAt: -1 });

    const earningsByDriver: any[] = [];

    for (let i = 0; i < trips.length; i++) {
      const currentTrip = trips[i];
      const existing = earningsByDriver.find(
        entry => entry.driverId === currentTrip.driverId
      );

      if (existing) {
        existing.totalMoney = parseFloat(
          (existing.totalMoney + currentTrip.shareOfDriver).toFixed(2)
        );
        existing.tripIds.push(currentTrip.id);
      } else {
        earningsByDriver.push({
          driverId: currentTrip.driverId,
          totalMoney: parseFloat(currentTrip.shareOfDriver.toFixed(2)),
          tripIds: [currentTrip.id],
        });
      }
    }

    for (let i = 0; i < earningsByDriver.length; i++) {
      const singleData = earningsByDriver[i];
      const driverId = singleData.driverId;
      let userData: any = await userModel.findOne({ id: driverId });
      userData = userData.toObject();
      delete userData.passwordHash;
      singleData.driverData = userData;
      delete singleData.driverId;
      const stringData = JSON.stringify(singleData);
      const savedData = await TempModel.create({ data: stringData });
      singleData.id = savedData.id;
      const oneTripId = singleData.tripIds[0];
      const oneTripData = await TripModel.findOne({ id: oneTripId });
      if (!oneTripData) {
        continue;
      }
      if (oneTripData.isPaymentReceivedByDriver) {
        singleData.paymentToDriverStatus = 'paid';
      } else {
        singleData.paymentToDriverStatus = 'not_paid';
      }
    }

    return sendResponse(res, {
      code: StatusCodes.OK,
      message: 'withdrawal requests fetched successfully',
      data: {
        data: earningsByDriver,
      },
    });
  }
);
