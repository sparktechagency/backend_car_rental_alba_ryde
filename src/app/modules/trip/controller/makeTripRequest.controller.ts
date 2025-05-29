import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import {
  getUserDataFromRequest,
  getUserDataFromRequest2,
} from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';

export const makeTripRequestController = myControllerHandler(
  async (req, res) => {
    const userData: any = await getUserDataFromRequest2(req);

    const { pickupLocation, dropOffLocation } = req.body;
    const pickupCoordinates = [
      Number(pickupLocation.longitude),
      Number(pickupLocation.latitude),
    ];
    const dropoffCoordinates = [
      Number(dropOffLocation.longitude),
      Number(dropOffLocation.latitude),
    ];

    await TripModel.create({
      customerId: userData.id,
      pickupLocation: {
        type: 'Point',
        coordinates: pickupCoordinates,
      },
      dropoffLocation: {
        type: 'Point',
        coordinates: dropoffCoordinates,
      },
    });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
