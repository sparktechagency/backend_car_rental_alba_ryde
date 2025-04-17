import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { parseBearerJwtToken } from '../../../../helpers/jwtAR7';
import jwt from 'jsonwebtoken';
export const signInWithMicrosoftController = myControllerHandler(
  async (req, res) => {
    const { idToken, accessToken } = req.body;
    const authData = await jwt.decode(idToken, { complete: true });
    console.log(authData?.payload);
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
