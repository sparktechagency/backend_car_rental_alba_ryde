import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { GOOGLE_MAP_API_KEY } from '../../../../data/environmentVariables';
import axios from 'axios';
import { calculateTripPrice } from '../../../../helpers_v2/trip/calculateTripPrice.helper';
import { TripPriceModel } from '../model/tripPrice.model';
import { findNearestDrivers } from '../../../../helpers_v2/trip/findNearestDriver.helper';
import { CarModel } from '../../car/model/car.model';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';

export const getAvailableCarListAndPriceController = myControllerHandler(
  async (req, res) => {
    const userData: any = await getUserDataFromRequest2(req);
    console.log(userData);
    const {
      pickup_location_longitude,
      pickup_location_latitude,
      dropoff_location_longitude,
      dropoff_location_latitude,
    } = req.query;
    const pickupLocationCoordinates = [
      Number(pickup_location_longitude),
      Number(pickup_location_latitude),
    ];
    const dropoffLocationCoordinates = [
      Number(dropoff_location_longitude),
      Number(dropoff_location_latitude),
    ];

    const origins = `${pickup_location_latitude},${pickup_location_longitude}`;
    const destinations = `${dropoff_location_latitude},${dropoff_location_longitude}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destinations}&key=${GOOGLE_MAP_API_KEY}`;
    const response = await axios.get(url, {
      params: {
        origins,
        destinations,
        key: GOOGLE_MAP_API_KEY,
        mode: 'driving', // optional, can be driving, walking, bicycling, transit
      },
    });
    const myData = response.data.rows[0].elements[0];
    console.log(myData);
    if (myData.status === 'NOT_FOUND' || myData.status === 'ZERO_RESULTS') {
      throw new Error('there is no road between these two locations.');
    }
    const distanceInMeters = myData.distance.value;
    const distanceInKM = distanceInMeters / 1000;
    const tripPrice = calculateTripPrice(distanceInKM);

    const nearestDrivers = await findNearestDrivers(
      Number(pickup_location_longitude),
      Number(pickup_location_latitude)
    );
    const carsTypes: string[] = [];

    for (let i = 0; i < nearestDrivers.length; i++) {
      const singleData = nearestDrivers[i];
      const carData = await CarModel.findOne({ ownerId: singleData.id });
      console.log(carData);
      if (!carData) {
        continue;
      }
      const carType_ = carData.carType;
      if (!carsTypes.includes(carType_)) {
        carsTypes.push(carType_);
      }
    }

    const refinedData: any = [];
    for (let i = 0; i < carsTypes.length; i++) {
      const singleType = carsTypes[i];

      const priceData = await TripPriceModel.create({
        carType: singleType,
        price: tripPrice,
        customerId: userData.id,
        pickupLocation: {
          coordinates: pickupLocationCoordinates,
        },
        dropoffLocation: { coordinates: dropoffLocationCoordinates },
      });
      refinedData.push(priceData);
    }
    console.log(refinedData);

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        refinedData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
