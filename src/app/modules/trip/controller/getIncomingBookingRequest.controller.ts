import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { CarModel } from '../../car/model/car.model';
import { TripModel } from '../model/trip.model';

export const getIncomingBookingRequestController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const carData = await CarModel.findOne({ ownerId: userData.id });
    console.log(carData?.carType);
    if (!carData) {
      throw new Error(
        'you are not eligible to see this data because you do not have a car.'
      );
    }

    const incomingRequest = await TripModel.find({
      type: 'user_request',
      carType: carData.carType,
    });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: incomingRequest,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
