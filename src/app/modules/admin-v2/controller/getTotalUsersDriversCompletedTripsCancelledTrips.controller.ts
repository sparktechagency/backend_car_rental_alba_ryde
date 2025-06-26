import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { TripModel } from '../../trip/model/trip.model';
import sendResponse from '../../../../shared/sendResponse';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';

export const getTotalUsersDriversCompletedTripsCancelledTripsController =
  myControllerHandler(async (req, res) => {
    await checkIfUserRequestingAdmin3(req);
    const totalUsers = await userModel.countDocuments({
      role: 'user',
    });
    const totalDrivers = await userModel.countDocuments({
      role: 'driver',
    });
    const totalCompletedTrips = await TripModel.countDocuments({
      status: 'completed',
    });
    const totalCancelledTrips = await TripModel.countDocuments({
      status: 'cancelled',
    });
    const data: any = [
      {
        title: 'Total Users',
        value: totalUsers,
      },
      {
        title: 'Total Drivers',
        value: totalDrivers,
      },
      {
        title: 'Total Completed Trips',
        value: totalCompletedTrips,
      },
      {
        title: 'Total Cancelled Trips',
        value: totalCancelledTrips,
      },
    ];
    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Fetched Successfully',
      data: {
        data: data,
      },
    });
  });
