import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';
import { RejectedByDriverModel } from '../model/rejectedByDriver.model';

export const rejectTripController = myControllerHandler(async (req, res) => {
  const { trip_id } = req.body;
  const userData = await getUserDataFromRequest2(req);
  const tripData = await TripModel.findOne({
    id: trip_id,
  });
  if (!tripData) {
    throw new Error('trip does not exist with this id');
  }
  const alreadyRejectData = await RejectedByDriverModel.findOne({
    driverId: userData.id,
    tripId: tripData.id,
  });
  if (alreadyRejectData) {
    throw new Error('you already rejected this trip');
  }

  if (tripData.driverId === userData.id) {
    throw new Error('you already accepted this');
  }
  if (tripData.status !== 'not_accepted') {
    throw new Error('this trip is not rejectable');
  }
  const rejectData = await RejectedByDriverModel.create({
    driverId: userData.id,
    tripId: tripData.id,
  });

  const myResponse = {
    message: 'Trip Rejected Successfully',
    success: true,
    data: {
      rejectData,
    },
  };
  res.status(StatusCodes.OK).json(myResponse);
});
