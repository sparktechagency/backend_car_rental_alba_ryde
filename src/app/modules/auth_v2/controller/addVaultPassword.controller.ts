import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const addVaultPasswordController = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const tokenData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = tokenData;
    const { vaultPassword } = req.body;
    const passwordHash = await hashMyPassword(vaultPassword);
    await userModelOfMantled.findOneAndUpdate(
      { email },
      { vaultPasswordHash: passwordHash }
    );

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Vault password updated successfully',
      data: {},
    });
  }
);
