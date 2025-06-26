import { StatusCodes } from 'http-status-codes';
import { JWT_SECRET_KEY } from '../../../../data/environmentVariables';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { jwt } from '../../../../utils/others/ForUnsupportedImportSuggestion';
import { userModel } from '../model/user.model';
import { otpModel } from '../model/otp.model';

export const changePasswordOfForgotPasswordController3 = myControllerHandler(
  async (req, res) => {
    const { otp, newPassword } = req.body;

    if (!otp) {
      throw new Error('please enter otp');
    }
    if (!newPassword) {
      throw new Error('please enter new password');
    }
    const otpData = await otpModel.findOne({ otp });
    if (!otpData) {
      throw new Error('this otp is not valid');
    }

    const authData: any = jwt.verify(otpData.token, JWT_SECRET_KEY);
    const { userId } = authData;
    const userData = await userModel.findOne({ id: userId });
    if (!userData) {
      throw new Error('user does not exist with this token');
    }

    const newPasswordHash: any = await hashMyPassword(newPassword);
    userData.passwordHash = newPasswordHash;
    await userData.save();
    await otpData.deleteOne();
    res.status(StatusCodes.OK).json({
      message: 'password updated successful',
    });
  }
);
