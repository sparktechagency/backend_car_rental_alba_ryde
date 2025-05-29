import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { TripModel } from '../model/trip.model';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';

export const acceptTripRequestController = myControllerHandler(
  async (req, res) => {
    const { trip_id } = req.body;
    const tripData = await TripModel.findOne({
      id: trip_id,
    });
    const userData: any = await getUserDataFromRequest2(req);
    // const pendingTripOfDriver = await TripModel.findOne({
    //   status: 'ongoing',
    //   driverId: userData.id,
    // });

    // if (pendingTripOfDriver) {
    //   throw new Error('plz complete your ongoing trip first');
    // }

    if (!tripData) {
      throw new Error('this trip data does not exist with this id');
    }

    if (tripData.status !== 'not_accepted') {
      throw new Error('this trip is not acceptable');
    }

    if (tripData.customerId === userData.id) {
      throw new Error('user can not accept his own drive request');
    }

    tripData.driverId = userData.id;
    tripData.status = 'pending';
    await tripData.save();

    const myResponse = {
      message: 'Trip Accepted Successfully',
      success: true,
      data: {
        tripData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
