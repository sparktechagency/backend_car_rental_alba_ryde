import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getEstimatedDistanceAndTime } from '../../../../helpers_v2/location/getEstimatedDistanceAndTime.helper';
import { userModel } from '../../auth_v2/model/user.model';
import { CarModel } from '../../car/model/car.model';
import { TripModel } from '../model/trip.model';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { convertToDate } from '../../../../helpers_v2/date/toDate';

export const getAvailableCarsToBookController = myControllerHandler(
  async (req, res) => {
    const {
      pickup_location_longitude,
      pickup_location_latitude,
      dropoff_location_longitude,
      dropoff_location_latitude,
      pickup_time,
    } = req.body;
    const userData = await getUserDataFromRequest2(req);

    const estimatedTimeAndDuration = await getEstimatedDistanceAndTime(
      pickup_location_latitude,
      pickup_location_longitude,
      dropoff_location_latitude,
      dropoff_location_longitude
    );
    if (!estimatedTimeAndDuration) {
      throw new Error('road does not exist between this two location');
    }
    const estimatedTimeInSeconds = estimatedTimeAndDuration.time.second;
    const pickupTime = new Date(pickup_time);
    const bookedData = await TripModel.find({
      type: 'booked',
      status: { $in: ['accepted', 'ongoing'] },
    });

    const arrayOfDriverIdBusyAtThatTime: any = [];
    for (let i = 0; i < bookedData.length; i++) {
      const singleData = bookedData[i];
      const estimatedTimeInSeconds1: any = singleData.estimatedTimeInSeconds;
      const pickupTime1: any = singleData.pickupTime; // Already Date
      const pickupTime2: Date = pickupTime; // Already Date
      const estimatedTimeInSeconds2: number = estimatedTimeInSeconds; // Your second trip's duration

      // Calculate end times
      const trip1EndTime = new Date(
        pickupTime1.getTime() + estimatedTimeInSeconds1 * 1000
      );
      const trip2EndTime = new Date(
        pickupTime2.getTime() + estimatedTimeInSeconds2 * 1000
      );

      // Check if intervals overlap
      const tripsOverlap =
        pickupTime1 <= trip2EndTime && pickupTime2 <= trip1EndTime;
      if (tripsOverlap) {
        arrayOfDriverIdBusyAtThatTime.push(singleData.driverId);
      }
    }
    const driverData = await userModel.find({
      id: {
        $nin: arrayOfDriverIdBusyAtThatTime,
      },
    });
    const idOfDrivers: string[] = [];
    for (let i = 0; i < driverData.length; i++) {
      idOfDrivers.push(driverData[i].id);
    }
    const carData = await CarModel.find({
      ownerId: {
        $in: idOfDrivers,
      },
    });
    const arrayOfCarnameAndPrice: any = [];

    for (let i = 0; i < carData.length; i++) {
      const singleData = carData[i];
      const newSingleData = {
        carType: singleData.carType,
        pricePerHour: singleData.approvedPricePerHour,
        pricePerKilometer: singleData.approvedPricePerKilometer,
      };
      let doesMatch = false;
      for (let i = 0; i < arrayOfCarnameAndPrice.length; i++) {
        const singleData2 = arrayOfCarnameAndPrice[i];
        if (
          singleData2.carType === newSingleData.carType &&
          singleData2.pricePerHour === newSingleData.pricePerHour
        ) {
          doesMatch = true;
        }
      }
      if (!doesMatch) {
        arrayOfCarnameAndPrice.push(newSingleData);
      }
    }

    const pickupLocationCoordinates = [
      Number(pickup_location_longitude),
      Number(pickup_location_latitude),
    ];
    const dropoffLocationCoordinates = [
      Number(dropoff_location_longitude),
      Number(dropoff_location_latitude),
    ];

    const refinedData: any = [];
    for (let i = 0; i < arrayOfCarnameAndPrice.length; i++) {
      const singleData = arrayOfCarnameAndPrice[i];
      const totalEstimatedTime = estimatedTimeAndDuration.time.second;
      const totalDistanceInKilometers =
        estimatedTimeAndDuration.distance.kilometer;
      let totalPrice = singleData.pricePerKilometer * totalDistanceInKilometers;
      totalPrice = Math.floor(totalPrice * 100) / 100;

      const myData = await TripModel.create({
        type: 'user_search',
        customerId: userData.id,
        pickupLocation: {
          type: 'Point',
          coordinates: pickupLocationCoordinates,
        },
        dropoffLocation: {
          type: 'Point',
          coordinates: dropoffLocationCoordinates,
        },
        estimatedTimeInSeconds: totalEstimatedTime,
        distanceInKilometers: totalDistanceInKilometers,
        price: totalPrice,
        carType: singleData.carType,
        pickupTime: convertToDate(pickup_time),
      });
      refinedData.push(myData);
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        totalAmount: refinedData.length,
        refinedData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
