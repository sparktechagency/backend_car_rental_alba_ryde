import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { MAXIMUM_DISTANCE_BETWEEN_USER_AND_DRIVER_IN_KM } from '../../../../data/environmentVariables';
import { userModel } from '../../auth_v2/model/user.model';
import { LocationModel } from '../../location/model/location.model';

export const getNearestDriverAccordingToCoordinatesWithPaginationController =
  myControllerHandler(async (req, res) => {
    const { page = '1', limit = '10', longitude, latitude } = req.query; // Get page and limit from query params with default values
    const refinedPage = Number(page);
    const refinedLimit = Number(limit);
    const numbersToSkip = (refinedPage - 1) * refinedLimit;

    const radiusInKm = MAXIMUM_DISTANCE_BETWEEN_USER_AND_DRIVER_IN_KM;
    const radiusInRadians = radiusInKm / 6371;

    // Find locations within radius
    const peoplesData = await LocationModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians], // [longitude, latitude] & radius in radians
        },
      },
    });

    const arrayOfUserId = peoplesData.map(item => item.userId);

    // Find users with those userIds and role 'driver'
    const totalDrivers = await userModel.countDocuments({
      id: { $in: arrayOfUserId },
      role: 'driver',
    });

    // Apply pagination using skip and limit
    const dataOfPeoplesNear = await userModel
      .find({
        id: { $in: arrayOfUserId },
        role: 'driver',
      })
      .skip(numbersToSkip)
      .limit(refinedLimit);

    // Remove sensitive data
    const refinedData = dataOfPeoplesNear.map(user => {
      const obj = user.toObject();
      delete obj.passwordHash;
      return obj;
    });

    const totalNumberOfPages = Math.ceil(totalDrivers / refinedLimit);

    const myResponse = {
      message: 'Nearest People Fetched Successfully',
      success: true,
      data: refinedData,
      currentPage: refinedPage,
      totalNumberOfItems: totalDrivers,
      totalNumberOfPages,
    };
    res.status(StatusCodes.OK).json(myResponse);
  });
