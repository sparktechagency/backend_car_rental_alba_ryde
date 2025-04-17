import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import {
  checkMyPassword,
  hashMyPassword,
} from '../../../../helpers/passwordHashing';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import sendResponse from '../../../../shared/sendResponse';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const updateVaultPasswordController = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = authData;
    const { oldVaultPassword, newVaultPassword } = req.body;

    if (!oldVaultPassword || !newVaultPassword) {
      return sendResponse(res, {
        code: StatusCodes.BAD_REQUEST,
        message: 'Both old and new vault passwords are required',
        data: {},
      });
    }

    const userData = await userModelOfMantled.findOne({ email });

    if (!userData) {
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'User does not exist with this token',
        data: {},
      });
    }

    const vaultPasswordHash = userData.vaultPasswordHash as string;

    const isPasswordValid = await checkMyPassword(
      oldVaultPassword,
      vaultPasswordHash
    );
    if (!isPasswordValid) {
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Old vault password is incorrect',
        data: {},
      });
    }

    const newVaultPasswordHash = await hashMyPassword(newVaultPassword);
    await userModelOfMantled.findOneAndUpdate(
      { id: userData.id },
      { vaultPasswordHash: newVaultPasswordHash }
    );

    return sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Vault password updated successfully',
      data: {},
    });
  }
);
