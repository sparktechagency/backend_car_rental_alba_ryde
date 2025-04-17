import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import {
  jwtSecretKey,
  jwtSecretKeyOfVault,
} from '../../../../data/environmentVariables';
import { giveAuthenticationToken } from '../../../../helpers/jwtAR7';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const fingerPrintVerificationController = myControllerHandler(
  async (req, res) => {
    // await checkIsBanned2(req);
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = authData;
    const vaultToken = await giveAuthenticationToken(
      email,
      jwtSecretKeyOfVault
    );

    const myResponse = {
      message: 'Fingerprint Verification',
      success: true,
      vaultToken,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
