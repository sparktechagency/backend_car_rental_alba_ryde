import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { extractLocationHelper } from '../../../../helpers_v2/property_begger/extractLocationWithAi.helper';

export const extractLocationDataFromNLController = myControllerHandler(
  async (req, res) => {
    const { message } = req.body;
    const locationData = await extractLocationHelper(message);
    console.log(locationData);
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: locationData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
