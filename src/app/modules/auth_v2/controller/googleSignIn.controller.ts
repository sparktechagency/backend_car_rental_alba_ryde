import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { parseBearerJwtToken } from '../../../../helpers/jwtAR7';
import jwt from 'jsonwebtoken';
export const signInWithGoogleController = myControllerHandler(
  async (req, res) => {
    const { credential } = req.body;
    const decodedData = await jwt.decode(credential, { complete: true });
    console.log(decodedData?.payload);
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
