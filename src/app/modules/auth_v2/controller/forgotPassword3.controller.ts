import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { giveAuthenticationToken2 } from '../../../../helpers/jwtAR7';
import { GenerateRandom6DigitNumber } from '../../../../helpers/GenerateRandom5DigitNumber';
import { sendPasswordResetOtpViaEmail } from '../../../../helpers/sendPasswordResetOtpViaEmail';
import { userModel } from '../model/user.model';
import { otpModel } from '../model/otp.model';

export const forgotPasswordController3 = myControllerHandler(
  async (req, res) => {
    const { email } = req.body;
    const userData = await userModel.findOne({ email });
    if (!userData) {
      throw new Error('user does not exist with this email');
    }
    const token = await giveAuthenticationToken2(userData.id);
    const otp: any = GenerateRandom6DigitNumber();
    await otpModel.create({
      otp,
      token,
    });
    await sendPasswordResetOtpViaEmail(userData.name, userData.email, otp);

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {
        otp,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
