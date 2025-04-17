import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import {
  checkMyPassword,
  hashMyPassword,
} from '../../../../helpers/passwordHashing';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const changePasswordInSettingsController = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    if (!authData?.email) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Invalid authentication',
        success: false,
      });
    }

    const { email } = authData;
    const userData: any = await userModelOfMantled.findOne({ email });

    if (!userData) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'User does not exist',
        success: false,
      });
    }

    const { oldPassword, newPassword } = req.body;

    const isPasswordValid = await checkMyPassword(
      oldPassword,
      userData.passwordHash
    );
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Incorrect old password',
        success: false,
      });
    }

    const passwordHashOfNewPassword = await hashMyPassword(newPassword);
    await userModelOfMantled.findOneAndUpdate(
      { id: userData.id },
      { passwordHash: passwordHashOfNewPassword }
    );

    return res.status(StatusCodes.OK).json({
      message: 'Password changed successfully',
      success: true,
      data: {},
    });
  }
);
