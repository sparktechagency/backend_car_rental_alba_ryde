import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import {
  getUserDataFromRequest,
  getUserDataFromRequest2,
} from '../../../../helpers/getUserDataFromRequest.helper';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { userModel } from '../model/user.model';

export const changePasswordInSettingsController2 = myControllerHandler(
  async (req, res) => {
    const userData: any = await getUserDataFromRequest2(req);
    const { new_password } = req.body;
    const newPasswordHash = await hashMyPassword(new_password);
    userData.passwordHash = newPasswordHash;
    await userData.save();
    const updatedUserData = await userModel.findOne({
      id: userData.id,
    });
    const myResponse = {
      message: 'Password updated successfully',
      success: true,
      data: updatedUserData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
