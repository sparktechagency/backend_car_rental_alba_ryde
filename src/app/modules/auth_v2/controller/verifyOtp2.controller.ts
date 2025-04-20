import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { unverifiedUsers } from '../../../../data/temporaryData';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { NotificationModel } from '../../notifications_v2/model/notification.model';
import { userModel } from '../model/user.model';
import { giveAuthenticationToken2 } from '../../../../helpers/jwtAR7';

export const verifyOtp2Controller = myControllerHandler(async (req, res) => {
  const { otp } = req.body;
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

  const { name, email, passwordHash, phone, role } =
    unverifiedUsers[userDataIndex];

  const existingUser = await userModelOfMantled.findOne({ email });

  if (existingUser) {
    return sendResponse(res, {
      code: StatusCodes.CONFLICT,
      message: 'User already exists',
      data: {},
    });
  }

  const userData = await userModel.create({
    name,
    email,
    passwordHash,
    phone,
    role,
  });

  // Remove the user from unverifiedUsers after successful verification
  unverifiedUsers.splice(userDataIndex, 1);

  await NotificationModel.create({
    type: 'for_admin',
    message: `${name} has joined your platform`,
    userId: 'hi',
    title: 'New User',
  });

  const authToken = await giveAuthenticationToken2(userData.id);

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'OTP verification complete, account created successfully',
    data: {
      authToken,
      userData,
    },
  });
});
