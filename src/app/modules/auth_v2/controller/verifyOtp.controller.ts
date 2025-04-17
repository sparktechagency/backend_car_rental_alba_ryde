import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { unverifiedUsers } from '../../../../data/temporaryData';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { NotificationModel } from '../../notifications_v2/model/notification.model';

export const verifyOtpController = myControllerHandler(async (req, res) => {
  const { otp } = req.body;
  console.log(req.body);
  if (!otp) {
    return sendResponse(res, {
      code: StatusCodes.BAD_REQUEST,
      message: 'OTP is required',
      data: {},
    });
  }

  const userDataIndex = unverifiedUsers.findIndex(
    (data: any) => data.otp === otp
  );

  if (userDataIndex === -1) {
    return sendResponse(res, {
      code: StatusCodes.UNAUTHORIZED,
      message: 'Invalid OTP',
      data: {},
    });
  }

  const { email, role, fullName, phoneNumber, passwordHash } =
    unverifiedUsers[userDataIndex];

  const existingUser = await userModelOfMantled.findOne({ email });

  if (existingUser) {
    return sendResponse(res, {
      code: StatusCodes.CONFLICT,
      message: 'User already exists',
      data: {},
    });
  }

  const userData = await userModelOfMantled.create({
    email,
    role,
    fullName,
    phoneNumber,
    passwordHash,
  });

  // Remove the user from unverifiedUsers after successful verification
  unverifiedUsers.splice(userDataIndex, 1);

  await NotificationModel.create({
    type: 'for_admin',
    message: `${fullName} has joined your platform`,
    userId: 'hi',
    title: 'New User',
  });

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'OTP verification complete, account created successfully',
    data: {},
  });
});
