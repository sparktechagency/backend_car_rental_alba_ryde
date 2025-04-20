import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { LocationModel } from '../model/location.model';

export const addLocationController = myControllerHandler(async (req, res) => {
  const { longitude, latitude } = req.body;
  const userData = (await getUserDataFromRequest2(req)) as any;

  const refinedCoordinates = [Number(longitude), Number(latitude)];

  let locationData: any = await LocationModel.findOne({ userId: userData.id });

  if (!locationData) {
    locationData = await LocationModel.create({
      userId: userData.id,
      location: { type: 'Point', coordinates: refinedCoordinates },
    });
  } else if (locationData) {
    locationData.location.coordinates = refinedCoordinates;
    await locationData.save();
  }

  const myResponse = {
    message: 'Location updated successfully',
    success: true,
    data: userData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
