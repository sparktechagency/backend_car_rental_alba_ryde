import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import {
  giveAuthenticationToken,
  parseBearerJwtToken,
} from '../../../../helpers/jwtAR7';
import jwt from 'jsonwebtoken';
import { userModel } from '../model/user.model';
import { JWT_SECRET_KEY } from '../../../../data/environmentVariables';
import { extractUsernameFromEmailAR7 } from '../../../../utils/others/returnUsernameIfEmail';
export const signUpOrInWithMicrosoftController = myControllerHandler(
  async (req, res) => {
    console.log(req.body);
    const { idToken, accessToken } = req.body;
    const authData: any = await jwt.decode(idToken, { complete: true });
    const { email, preferred_username } = authData.payload;
    const userData = await userModel.findOne({ email });
    if (!userData) {
      const username = extractUsernameFromEmailAR7(preferred_username);
      const userData2 = await userModel.create({
        name: username,
        email: email,
        role: 'user',
      });
      const userData3 = userData2.toObject();
      delete userData3.passwordHash;
      const authToken = await giveAuthenticationToken(email, JWT_SECRET_KEY);
      return res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Account Created Successfully',
        userData: userData3,
        token: authToken,
      });
    }
    const authToken = await giveAuthenticationToken(email, JWT_SECRET_KEY);
    const userData2 = userData.toObject();
    delete userData2.passwordHash;
    const myResponse = {
      message: 'Sign In Successful',
      success: true,
      userData: userData2,
      token: authToken,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
