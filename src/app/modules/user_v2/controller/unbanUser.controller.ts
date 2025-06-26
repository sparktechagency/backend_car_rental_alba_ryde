import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';
import sendResponse from '../../../../shared/sendResponse';

export const unBanUserController3 = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin3(req);
  const { userId } = req.body;
  const userData = await userModel.findOne({ id: userId });
  if (!userData) {
    throw new Error('user does not exist with this id');
  }
  if (userData.isBanned === false) {
    throw new Error('user is already unbanned');
  }
  userData.isBanned = false;
  await userData.save();

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User Unbanned Successfully',
    data: {},
  });
});
