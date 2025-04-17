import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { parseJwtToken } from '../../../../helpers/jwtAR7';
import {
  adminChangingPasswordJwtSecretKey,
  jwtSecretKey,
  secretKeyOfChangingPasswordToken,
} from '../../../../data/environmentVariables';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const changePasswordController = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const myData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = myData;

    const { newPassword } = req.body;

    const newHashedPassword = await hashMyPassword(newPassword);

    await userModelOfMantled.findOneAndUpdate(
      { email },
      { passwordHash: newHashedPassword }
    );

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'password changed successfully',
      data: {},
    });
  }
);
