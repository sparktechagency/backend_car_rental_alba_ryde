import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripPriceModel } from '../model/tripPrice.model';
import { TripModel } from '../model/trip.model';

export const requestForTripController = myControllerHandler(
  async (req, res) => {
    const userData: any = await getUserDataFromRequest2(req);
    const { priceId } = req.body;
    const myData = await TripPriceModel.findOne({ id: priceId });
    if (!myData) {
      throw new Error('invalid price id');
    }
    if (userData.id !== myData.customerId) {
      throw new Error('this user is not authorized to request for this trip');
    }

    const oldPendingTripdatas = await TripModel.find({
      customerId: userData.id,
      status: 'pending',
    });
    for (let i = 0; i < oldPendingTripdatas.length; i++) {
      const singleData = oldPendingTripdatas[i];
      await singleData.deleteOne();
    }

    const tripData = await TripModel.create({
      customerId: userData.id,
      status: 'not_accepted',
      pickupLocation: myData.pickupLocation,
      dropoffLocation: myData.dropoffLocation,
      price: myData.price,
      carType: myData.carType,
    });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: tripData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
