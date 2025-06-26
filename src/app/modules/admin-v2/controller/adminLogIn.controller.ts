import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { checkMyPassword } from '../../../../helpers/passwordHashing';
import { giveAuthenticationToken2 } from '../../../../helpers/jwtAR7';
import sendResponse from '../../../../shared/sendResponse';

export const adminLogInController = myControllerHandler(async (req, res) => {
  const { email, password } = req.body;
  const userData = await userModel.findOne({
    email: email,
  });
  if (!userData) {
    throw new Error('user does not exist');
  }
  if (!userData.passwordHash) {
    throw new Error('no password hash');
  }
  await checkMyPassword(password, userData.passwordHash);
  if (userData.role !== 'admin') {
    throw new Error('user is not admin');
  }
  const authToken = await giveAuthenticationToken2(userData.id);
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Logged In Successfully',
    data: {
      authToken,
    },
  });
});
