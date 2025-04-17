import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const getSettingsDataController = myControllerHandler(
  async (req, res) => {
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = authData;
    const userData = await userModelOfMantled.findOne({ email });
    if (!userData) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'User does not exists with this token' });
    }
    const userData2 = userData.toObject();
    userData2.passwordHash = '';
    userData2.vaultPasswordHash = '';

    const myResponse = {
      message: 'Data Fetched Successfull',
      success: true,
      data: userData2,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
