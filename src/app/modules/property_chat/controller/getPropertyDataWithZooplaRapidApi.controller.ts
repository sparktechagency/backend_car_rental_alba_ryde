import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import axios from 'axios';
import {
  ZOOPLA_RAPID_API_BASE_URL,
  ZOOPLA_RAPID_API_HOST,
  ZOOPLA_RAPID_API_KEY,
} from '../../../../data/environmentVariables';
import { zooplaRapidApiAR7 } from '../../../../helpers_v2/zoopla/zooplaRapidApi.helper';

export const getPropertyDataWithZooplaRapidController = myControllerHandler(
  async (req, res) => {
    const { geoIdentifier, geoLabel } = req.body;
    const locationData = await zooplaRapidApiAR7(geoIdentifier, geoLabel);
    const myResponse = {
      message: 'Property Data Successfully',
      success: true,
      data: locationData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
