import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse, { sendResponse2 } from '../../../../shared/sendResponse';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { checkMyPassword } from '../../../../helpers/passwordHashing';
import {
  giveAuthenticationToken,
  giveAuthenticationToken2,
} from '../../../../helpers/jwtAR7';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import {
  checkIsBanned,
  checkIsBanned2,
} from '../../../../helpers_v2/auth/checkIsBanned.helper';
import { userModel } from '../model/user.model';

export const signIn2Controller = myControllerHandler(async (req, res) => {
  await checkIsBanned2(req);

  const { email, password } = req.body;

  if (!email || !password) {
    return sendResponse(res, {
      code: StatusCodes.BAD_REQUEST,
      message: 'Email and password are required',
      data: {},
    });
  }

  const userData: any = await userModel.findOne({ email });
  if (!userData) {
    return sendResponse(res, {
      code: StatusCodes.UNAUTHORIZED,
      message: 'Invalid email or password',
      data: {},
    });
  }
  const userData2 = userData.toObject();
  const { passwordHash } = userData;
  if (!passwordHash) {
    return res.status(StatusCodes.FORBIDDEN).json({
      message:
        'please use google or microsoft to sign in, this account is created with sign up with google/microsoft',
    });
  }

  const isPasswordValid = await checkMyPassword(password, passwordHash);
  if (!isPasswordValid) {
    return sendResponse(res, {
      code: StatusCodes.UNAUTHORIZED,
      message: 'Invalid email or password',
      data: {},
    });
  }

  const jwtToken = await giveAuthenticationToken2(userData2.id);
  const bearerToken = `Bearer ${jwtToken}`;
  // wipe password hash
  userData2.passwordHash = '';

  return sendResponse2(res, {
    code: StatusCodes.OK,
    message: 'Signed in successfully',
    data: userData2,
    token: bearerToken,
  });
});
