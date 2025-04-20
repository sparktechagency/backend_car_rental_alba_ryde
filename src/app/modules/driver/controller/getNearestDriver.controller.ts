import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { MAXIMUM_DISTANCE_BETWEEN_USER_AND_DRIVER_IN_KM } from '../../../../data/environmentVariables';
import { userModel } from '../../auth_v2/model/user.model';
import { LocationModel } from '../../location/model/location.model';

export const getNearestDriverAccordingToCoordinatesController =
  myControllerHandler(async (req, res) => {
    const { longitude, latitude } = req.body;
    const radiusInKm = MAXIMUM_DISTANCE_BETWEEN_USER_AND_DRIVER_IN_KM;
    const radiusInRadians = radiusInKm / 6371;
    const peoplesData = await LocationModel.find({
      location: {
        $geoWithin: {
          $centerSphere: [[longitude, latitude], radiusInRadians], // [longitude, latitude] & radius in radians
        },
      },
    });

    const arrayOfUserId = [];

    for (let i = 0; i < peoplesData.length; i++) {
      const singleId = peoplesData[i].userId;
      arrayOfUserId.push(singleId);
    }

    const dataOfPeoplesNear = await userModel.find({
      id: {
        $in: arrayOfUserId,
      },
      role: 'driver',
    });

    const refinedData: any = [];
    for (let i = 0; i < dataOfPeoplesNear.length; i++) {
      let singleData: any = dataOfPeoplesNear[i].toObject();
      delete singleData.passwordHash;
      refinedData.push(singleData);
    }

    const myResponse = {
      message: 'Nearest People Fetched Successfully',
      success: true,
      data: refinedData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  });
