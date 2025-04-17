import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { GenerateRandom6DigitNumber } from '../../../../helpers/GenerateRandom5DigitNumber';
import { dataOfResetPasswordRequests } from '../../../../data/temporaryData';
import { sendOtpForPasswordChange } from '../../../../helpers/sendOtpToResetPassword';
import { userModelOfMantled } from '../model/userModelOfMantled.model';

export const forgotPasswordController = myControllerHandler(
  async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return sendResponse(res, {
          code: StatusCodes.BAD_REQUEST,
          message: 'Email is required',
          data: {},
        });
      }

      const savedUserData = await userModelOfMantled.findOne({ email });

      if (!savedUserData) {
        return sendResponse(res, {
          code: StatusCodes.NOT_FOUND,
          message: 'No user exists with this email',
          data: {},
        });
      }

      const otp = GenerateRandom6DigitNumber().toString();
      const nameOfUser = savedUserData.fullName;
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

      return sendResponse(res, {
        code: StatusCodes.OK,
        message: 'OTP sent successfully',
        data: {
          otp,
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
