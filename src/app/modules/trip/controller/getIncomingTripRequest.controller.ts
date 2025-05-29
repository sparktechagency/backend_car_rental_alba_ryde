import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { LocationModel } from '../../location/model/location.model';
import { TripModel } from '../model/trip.model';
import { MAXIMUM_DISTANCE_BETWEEN_DRIVER_AND_PICKUP_LOCATION_IN_KM } from '../../../../data/environmentVariables';
import { CarModel } from '../../car/model/car.model';
import { RejectedByDriverModel } from '../model/rejectedByDriver.model';

export const getIncomingTripRequestController = myControllerHandler(
  async (req, res) => {
    const { page = '1', limit = '10' } = req.query;
    const refinedPage = Number(page);
    const refinedLimit = Number(limit);
    const numbersToSkip = (refinedPage - 1) * refinedLimit;

    const userData: any = await getUserDataFromRequest2(req);
    const userLocation = await LocationModel.findOne({ userId: userData.id });
    const rejectionData = await RejectedByDriverModel.find({
      driverId: userData.id,
    });
    const idOfRejectedTrips: string[] = [];

    for (let i = 0; i < rejectionData.length; i++) {
      idOfRejectedTrips.push(rejectionData[i].tripId);
    }

    if (!userLocation) {
      throw new Error('please turn on location sync');
    }

    const carData = await CarModel.findOne({ ownerId: userData.id });

    const userLocationCoordinates = userLocation.location?.coordinates;
    const radiusInKm =
      MAXIMUM_DISTANCE_BETWEEN_DRIVER_AND_PICKUP_LOCATION_IN_KM;
    const radiusInRadians = radiusInKm / 6371;

    const filter = {
      carType: carData?.carType,
      status: 'not_accepted',
      id: {
        $nin: idOfRejectedTrips,
      },
      pickupLocation: {
        $geoWithin: {
          $centerSphere: [userLocationCoordinates, radiusInRadians],
        },
      },
    };

    const totalRequests = await TripModel.countDocuments(filter);

    const nearestRequests = await TripModel.find(filter)
      .skip(numbersToSkip)
      .limit(refinedLimit);

    const totalNumberOfPages = Math.ceil(totalRequests / refinedLimit);

    const myResponse = {
      message: 'Nearest Trip Requests Fetched Successfully',
      success: true,
      currentPage: refinedPage,
      totalNumberOfItems: totalRequests,
      totalNumberOfPages,
      data: nearestRequests,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
