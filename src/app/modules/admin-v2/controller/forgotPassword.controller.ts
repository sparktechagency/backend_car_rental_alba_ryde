import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import {
  GenerateRandom5DigitNumber,
  GenerateRandom6DigitNumber,
} from '../../../../helpers/GenerateRandom5DigitNumber';
import { dataOfResetPasswordRequests } from '../../../../data/temporaryData';
import { sendPasswordResetOtpViaEmail } from '../../../../helpers/sendPasswordResetOtpViaEmail';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const adminForgotPasswordController = myControllerHandler(
  async (req, res) => {
    const { email } = req.body;
    const userData = await userModelOfMantled.findOne({
      email,
    });
    if (!userData) {
      throw new Error('user does not exists with this email');
    }

    const { fullName } = userData;
    const otp = GenerateRandom6DigitNumber().toString();
    const temporaryUserData = { email, otp, createdAt: Date.now() };
    dataOfResetPasswordRequests.push(temporaryUserData);

    await sendPasswordResetOtpViaEmail(fullName, email, otp);

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Email sent successfully',
      data: {},
    });
  }
);
