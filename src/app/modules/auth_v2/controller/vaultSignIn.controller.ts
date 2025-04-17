import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import {
  jwtSecretKey,
  jwtSecretKeyOfVault,
} from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { checkMyPassword } from '../../../../helpers/passwordHashing';
import { giveAuthenticationToken } from '../../../../helpers/jwtAR7';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const vaultSignInController = myControllerHandler(async (req, res) => {
  await checkIsBanned2(req);
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { email } = authData;
  const { vaultPassword } = req.body;

  if (!vaultPassword) {
    return sendResponse(res, {
      code: StatusCodes.BAD_REQUEST,
      message: 'Vault password is required',
      data: {},
    });
  }

  const userData = await userModelOfMantled.findOne({ email });

  if (!userData) {
    return sendResponse(res, {
      code: StatusCodes.NOT_FOUND,
      message: 'User does not exist',
      data: {},
    });
  }

  const passwordHashOfVaultPassword = userData.vaultPasswordHash as string;
  if (!passwordHashOfVaultPassword) {
    throw new Error('user did not created vault password yet');
  }

  const isPasswordValid = await checkMyPassword(
    vaultPassword,
    passwordHashOfVaultPassword
  );
  if (!isPasswordValid) {
    return sendResponse(res, {
      code: StatusCodes.UNAUTHORIZED,
      message: 'Invalid vault password',
      data: {},
    });
  }

  const vaultToken = await giveAuthenticationToken(email, jwtSecretKeyOfVault);

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Vault sign-in successful',
    data: {
      vaultToken: `Bearer ${vaultToken}`,
    },
  });
});
