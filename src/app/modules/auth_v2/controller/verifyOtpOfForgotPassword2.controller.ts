import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse, { sendResponse2 } from '../../../../shared/sendResponse';
import { dataOfResetPasswordRequests } from '../../../../data/temporaryData';
import { giveAuthenticationToken } from '../../../../helpers/jwtAR7';
import {
  jwtSecretKey,
  secretKeyOfChangingPasswordToken,
} from '../../../../data/environmentVariables';
import { userModel } from '../model/user.model';

export const verifyOtpOfForgotPasswordController2 = myControllerHandler(
  async (req, res) => {
    const { otp } = req.body;

    if (!otp) {
      return sendResponse(res, {
        code: StatusCodes.BAD_REQUEST,
        message: 'OTP is required',
        data: {},
      });
    }

    const userDataIndex = dataOfResetPasswordRequests.findIndex(
      (data: any) => otp === data.otp
    );

    if (userDataIndex === -1) {
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Invalid OTP',
        data: {},
      });
    }

    const { email } = dataOfResetPasswordRequests[userDataIndex];

    // Remove the verified OTP entry from the list to prevent reuse
    // dataOfResetPasswordRequests.splice(userDataIndex, 1);

    const token = await giveAuthenticationToken(email, jwtSecretKey);
    const userData = await userModel.findOne({ email });

    return sendResponse2(res, {
      code: StatusCodes.OK,
      message: 'OTP verified successfully',
      data: { userData },
      token,
    });
  }
);
