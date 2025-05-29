import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { LocationModel } from '../../location/model/location.model';
import { generateRandomLocationsWithin } from '../../../../helpers_v2/location/generateRandomLocationsWithin.helper';

export const changeAllDriverLocationToNearestController = myControllerHandler(
  async (req, res) => {
    const { longitude, latitude, within } = req.body;

    const userData = await userModel.find({
      role: 'driver',
    });

    const arrayOfUserId: string[] = [];

    for (let i = 0; i < userData.length; i++) {
      const singleUserId = userData[i].id;
      const locationData = await LocationModel.findOne({
        userId: singleUserId,
      });
      if (locationData) {
        const coordinates = locationData.location?.coordinates;

        const newCoordinates = generateRandomLocationsWithin(
          Number(longitude),
          Number(latitude),
          within
        );

        const newLongitude = newCoordinates.longitude;
        const newLatitude = newCoordinates.latitude;
        const newCoordinates2 = [newLongitude, newLatitude];
        if (locationData.location) {
          locationData.location.coordinates = newCoordinates2;
          await locationData.save();
        }
      } else {
        const newCoordinates = generateRandomLocationsWithin(
          Number(longitude),
          Number(latitude),
          within
        );

        const newLongitude = newCoordinates.longitude;
        const newLatitude = newCoordinates.latitude;
        const newCoordinates2 = [newLongitude, newLatitude];

        await LocationModel.create({
          userId: singleUserId,
          location: {
            type: 'Point',
            coordinates: newCoordinates2,
          },
        });
      }
    }

    const myResponse = {
      message: 'Locations updated Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
