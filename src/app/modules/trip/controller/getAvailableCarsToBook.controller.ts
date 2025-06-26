import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import {
  getEstimatedDistanceAndTime,
  getEstimatedDistanceAndTimeWithPolyline,
} from '../../../../helpers_v2/location/getEstimatedDistanceAndTime.helper';
import { userModel } from '../../auth_v2/model/user.model';
import { CarModel } from '../../car/model/car.model';
import { TripModel } from '../model/trip.model';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { convertToDate } from '../../../../helpers_v2/date/toDate';
import { PROFIT_PERCENTAGE_OF_APP } from '../../../../data/environmentVariables';
import { roundToDecimal } from '../../../../helpers_v2/math/roundToDecimal.helper';

export const getAvailableCarsToBookController = myControllerHandler(
  async (req, res) => {
    // Extract pickup/dropoff coordinates and time from request body
    const {
      pickup_location_longitude,
      pickup_location_latitude,
      dropoff_location_longitude,
      dropoff_location_latitude,
      pickup_time,
    } = req.body;

    // Get logged-in user data from request token/session
    const userData = await getUserDataFromRequest2(req);

    // Get estimated distance, duration, and route polyline using Google Directions API
    const estimatedTimeAndDuration =
      await getEstimatedDistanceAndTimeWithPolyline(
        pickup_location_latitude,
        pickup_location_longitude,
        dropoff_location_latitude,
        dropoff_location_longitude
      );

    // If route is not found, throw an error
    if (!estimatedTimeAndDuration) {
      throw new Error('road does not exist between this two location');
    }

    const estimatedTimeInSeconds = estimatedTimeAndDuration.time.second;
    const pickupTime = new Date(pickup_time);

    // Find all existing trips that are either accepted or ongoing
    const bookedData = await TripModel.find({
      type: 'booked',
      status: { $in: ['accepted', 'ongoing'] },
    });

    // Collect driver IDs who are busy during the requested time
    const arrayOfDriverIdBusyAtThatTime: any = [];
    for (let i = 0; i < bookedData.length; i++) {
      const singleData = bookedData[i];
      const estimatedTimeInSeconds1: any = singleData.estimatedTimeInSeconds;
      const pickupTime1: any = singleData.pickupTime;
      const pickupTime2: Date = pickupTime;
      const estimatedTimeInSeconds2: number = estimatedTimeInSeconds;

      // Calculate end time for both trips
      const trip1EndTime = new Date(
        pickupTime1.getTime() + estimatedTimeInSeconds1 * 1000
      );
      const trip2EndTime = new Date(
        pickupTime2.getTime() + estimatedTimeInSeconds2 * 1000
      );

      // Check if the new trip overlaps with existing trip
      const tripsOverlap =
        pickupTime1 <= trip2EndTime && pickupTime2 <= trip1EndTime;

      // If overlapping, mark driver as busy
      if (tripsOverlap) {
        arrayOfDriverIdBusyAtThatTime.push(singleData.driverId);
      }
    }

    // Get available drivers who are not busy during requested time
    const driverData = await userModel.find({
      id: {
        $nin: arrayOfDriverIdBusyAtThatTime,
      },
    });

    // Extract available driver IDs
    const idOfDrivers: string[] = [];
    for (let i = 0; i < driverData.length; i++) {
      idOfDrivers.push(driverData[i].id);
    }

    // Get cars belonging to available drivers
    const carData = await CarModel.find({
      ownerId: {
        $in: idOfDrivers,
      },
    });

    // Prepare unique list of car types and their pricing
    const arrayOfCarnameAndPrice: any = [];
    for (let i = 0; i < carData.length; i++) {
      const singleData = carData[i];
      const newSingleData = {
        carType: singleData.carType,
        pricePerKilometer: singleData.approvedPricePerKilometer,
      };

      let doesMatch = false;
      for (let i = 0; i < arrayOfCarnameAndPrice.length; i++) {
        const singleData2 = arrayOfCarnameAndPrice[i];
        if (
          singleData2.carType === newSingleData.carType &&
          singleData2.pricePerKilometer === newSingleData.pricePerKilometer
        ) {
          doesMatch = true;
        }
      }

      if (!doesMatch) {
        arrayOfCarnameAndPrice.push(newSingleData);
      }
    }

    // Prepare pickup and dropoff GeoJSON coordinates
    const pickupLocationCoordinates = [
      Number(pickup_location_longitude),
      Number(pickup_location_latitude),
    ];
    const dropoffLocationCoordinates = [
      Number(dropoff_location_longitude),
      Number(dropoff_location_latitude),
    ];

    // For each unique car type/price, create a Trip entry and calculate total price

    const refinedData: any = [];
    const arrayOfRefinedCarData: any = [];
    for (let i = 0; i < arrayOfCarnameAndPrice.length; i++) {
      const singleData = arrayOfCarnameAndPrice[i];
      const totalEstimatedTime = estimatedTimeAndDuration.time.second;
      const totalDistanceInKilometers =
        estimatedTimeAndDuration.distance.kilometer;

      // Calculate total price for the trip
      const shareOfDriver =
        singleData.pricePerKilometer * totalDistanceInKilometers;
      const shareOfApp = shareOfDriver * (PROFIT_PERCENTAGE_OF_APP / 100);
      const totalPrice = shareOfDriver + shareOfApp;
      // totalPrice = Math.floor(totalPrice * 100) / 100; // round to 2 decimal places

      // Create trip document of type "user_search"
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
        totalPrice: roundToDecimal(totalPrice, 2),
        shareOfDriver: roundToDecimal(shareOfDriver, 2),
        shareOfApp: roundToDecimal(shareOfApp, 2),
        carType: singleData.carType,
        pickupTime: convertToDate(pickup_time),
        routePolyline: estimatedTimeAndDuration.polyline,
      });
      const refinedSingleCarData = {
        carType: myData.carType,
        totalPrice: myData.totalPrice,
      };
      arrayOfRefinedCarData.push(refinedSingleCarData);
      refinedData.push(myData);
    }

    // Send final response with available trips
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        totalAmount: arrayOfRefinedCarData.length,
        arrayOfRefinedCarData,
      },
    };

    res.status(StatusCodes.OK).json(myResponse);
  }
);
