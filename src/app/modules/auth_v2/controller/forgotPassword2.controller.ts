import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { GenerateRandom6DigitNumber } from '../../../../helpers/GenerateRandom5DigitNumber';
import { dataOfResetPasswordRequests } from '../../../../data/temporaryData';
import { sendOtpForPasswordChange } from '../../../../helpers/sendOtpToResetPassword';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { userModel } from '../model/user.model';

export const forgotPasswordController2 = myControllerHandler(
  async (req, res) => {
    try {
      console.log(req.body);
      const { email } = req.body;

      if (!email) {
        return sendResponse(res, {
          code: StatusCodes.BAD_REQUEST,
          message: 'Email is required',
          data: {},
        });
      }

      const savedUserData = await userModel.findOne({ email });

      if (!savedUserData) {
        return sendResponse(res, {
          code: StatusCodes.NOT_FOUND,
          message: 'No user exists with this email',
          data: {},
        });
      }

      const otp = GenerateRandom6DigitNumber().toString();
      const nameOfUser = savedUserData.name;
      const dataOfUser = { email, otp };
      dataOfResetPasswordRequests.push(dataOfUser);

      const otpSent = await sendOtpForPasswordChange(nameOfUser, email, otp);

      if (!otpSent) {
        return sendResponse(res, {
          code: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Failed to send OTP. Please try again later.',
          data: {},
        });
      }

      const savedUserData2 = savedUserData.toObject();
      delete savedUserData.passwordHash;
      return sendResponse(res, {
        code: StatusCodes.OK,
        message: 'OTP sent successfully',
        data: {
          otp,
          userData: savedUserData2,
        },
      });
    } catch (error: any) {
      console.error('Forgot Password Error:', error.message);
      return sendResponse(res, {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong. Please try again later.',
        data: {},
      });
    }
  }
);
