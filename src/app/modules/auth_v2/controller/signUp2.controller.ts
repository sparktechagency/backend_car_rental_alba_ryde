import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { GenerateRandom6DigitNumber } from '../../../../helpers/GenerateRandom5DigitNumber';
import { unverifiedUsers } from '../../../../data/temporaryData';
import { sendOtpViaEmail } from '../../../../helpers/sendOtp';
import { userModel } from '../model/user.model';

export const signUp2Controller = myControllerHandler(async (req, res) => {
  const { email, password, name, phone, role } = req.body;

  console.log(req.body);

  // Check for missing fields
  if (!email || !password || !name) {
    return sendResponse(res, {
      code: StatusCodes.BAD_REQUEST,
      message: 'All fields are required: email, password, name',
    });
  }
  if (!(role === 'user' || role === 'driver' || role === 'admin')) {
    throw new Error(`"role can only be "user", "driver" or "admin"`);
  }

  // Check if the user already exists
  const userData = await userModel.findOne({ email });
  if (userData) {
    return sendResponse(res, {
      code: StatusCodes.CONFLICT,
      message: 'User with this email already exists',
    });
  }

  // Hash password and generate OTP
  const passwordHash = await hashMyPassword(password);
  const otp = GenerateRandom6DigitNumber().toString();

  // Store user in temporary data
  const temporaryUserData = {
    email,
    passwordHash, // Store hashed password instead of plain text
    name,
    otp,
    phone,
    role,
  };
  unverifiedUsers.push(temporaryUserData);

  // Send OTP via email
  await sendOtpViaEmail(name, email, otp);

  // Success response
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'OTP sent successfully. Please verify your email.',
    data: { otp },
  });
});
