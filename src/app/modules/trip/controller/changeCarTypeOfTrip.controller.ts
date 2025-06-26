import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { TripModel } from '../model/trip.model';

export const changeCarTypeOfTripController = myControllerHandler(
  async (req, res) => {
    const tripdata = await TripModel.find({
      type: 'user_request',
    });
    for (let i = 0; i < tripdata.length; i++) {
      const singleData = tripdata[i];
      if (singleData.routePolyline) {
        singleData.carType = 'hatchback';
        await singleData.save();
      }
    }
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
