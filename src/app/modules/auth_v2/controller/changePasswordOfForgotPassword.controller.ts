import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { dataOfResetPasswordRequests } from '../../../../data/temporaryData';
import { userModel } from '../model/user.model';
import { hashMyPassword } from '../../../../helpers/passwordHashing';

export const changePasswordOfForgotPasswordController = myControllerHandler(
  async (req, res) => {
    const { otp, newPassword } = req.body;
    let userData = null as any;
    let index = null as any;
    for (let i = 0; i < dataOfResetPasswordRequests.length; i++) {
      const singleData = dataOfResetPasswordRequests[i];
      if (singleData.otp === otp) {
        userData = singleData;
        index = i;
      }
    }
    if (!userData) {
      throw new Error('Otp not valid');
    }

    const { email } = userData;
    const userData2 = await userModel.findOne({ email });
    if (!userData2) {
      throw new Error('user does not exist');
    }
    const newPasswordHash = (await hashMyPassword(newPassword)) as string;
    userData2.passwordHash = newPasswordHash;
    await userData2.save();
    dataOfResetPasswordRequests.splice(index, 1);
    const myResponse = {
      message: 'Password Changed Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
