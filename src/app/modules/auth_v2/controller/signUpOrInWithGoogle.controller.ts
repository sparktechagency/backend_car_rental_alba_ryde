import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { jwt } from '../../../../utils/others/ForUnsupportedImportSuggestion';
import { giveAuthenticationToken } from '../../../../helpers/jwtAR7';
import { JWT_SECRET_KEY } from '../../../../data/environmentVariables';
import { userModel } from '../model/user.model';

export const signUpOrInWithGoogleController = myControllerHandler(
  async (req, res) => {
    const { credential } = req.body;
    const authData: any = await jwt.decode(credential, { complete: true });
    const { given_name, email } = authData?.payload;
    const userData = await userModel.findOne({ email: email });
    if (!userData) {
      const userData2 = await userModel.create({
        name: given_name,
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
