import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';

export const unBanUserController3 = myControllerHandler(async (req, res) => {
  const { id } = req.body;
  const userData = await userModel.findOne({ id });
  if (!userData) {
    throw new Error('user does not exist with this id');
  }
  if (userData.isBanned === false) {
    throw new Error('user is already unbanned');
  }
  userData.isBanned = false;
  await userData.save();

  const myResponse = {
    message: 'User is unbanned Successfully',
    success: true,
    data: userData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
