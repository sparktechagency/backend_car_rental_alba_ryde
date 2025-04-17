import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const getOwnDataOfUserController = myControllerHandler(
  async (req, res) => {
    const tokenData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = tokenData;
    const dataOfUser = await userModelOfMantled.findOne({ email });
    if (!dataOfUser) {
      throw new Error('User does not exists.');
    }
    // wipe password hash
    dataOfUser.passwordHash = '';
    dataOfUser.vaultPasswordHash = '';
    res.status(StatusCodes.OK).json({
      message: 'Review Given Successfully',
      success: true,
      data: dataOfUser,
    });
  }
);
