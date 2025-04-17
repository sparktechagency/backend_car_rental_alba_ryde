import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { GenerateRandom6DigitNumber } from '../../../../helpers/GenerateRandom5DigitNumber';
import { unverifiedUsers } from '../../../../data/temporaryData';
import { sendOtpViaEmail } from '../../../../helpers/sendOtp';

export const signUpController = myControllerHandler(async (req, res) => {
  const { email, password, role, fullName, phoneNumber } = req.body;

  console.log(req.body);

  // Check for missing fields
  if (!email || !password || !role || !fullName || !phoneNumber) {
    return sendResponse(res, {
      code: StatusCodes.BAD_REQUEST,
      message:
        'All fields are required: email, password, role, fullName, phoneNumber',
    });
  }

  // Check if the user already exists
  const userData = await userModelOfMantled.findOne({ email });
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
    role,
    fullName,
    phoneNumber,
    otp,
  };
  unverifiedUsers.push(temporaryUserData);

  // Send OTP via email
  await sendOtpViaEmail(fullName, email, otp);

  // Success response
  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'OTP sent successfully. Please verify your email.',
    data: { otp },
  });
});
