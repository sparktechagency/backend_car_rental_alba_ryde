import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { saveFileToFolder } from '../../../../helpers/uploadFilesToFolder';
import refineUrlAr7 from '../../../../helpers/refineUrlAr7';
import sendResponse from '../../../../shared/sendResponse';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const updateProfileController = myControllerHandler(async (req, res) => {
  await checkIsBanned2(req);
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const dataFromUser = await getDataFromFormOfRequest(req);
  const { email } = authData;

  const userData = await userModelOfMantled.findOne({ email });
  if (!userData) {
    return sendResponse(res, {
      code: StatusCodes.NOT_FOUND,
      message: 'User does not exist',
      data: {},
    });
  }

  const updateFields: any = {};

  const fieldMappings: any = {
    name: 'fullName',
    occupation: 'occupation',
    maritalStatus: 'maritalStatus',
    email: 'email',
    phoneNumber: 'phoneNumber',
    dateOfBirth: 'dateOfBirth',
    address: 'address',
  };

  Object.keys(fieldMappings).forEach(key => {
    if (dataFromUser.fields[key]) {
      updateFields[fieldMappings[key]] = dataFromUser.fields[key][0];
    }
  });

  const fileMappings = {
    imageOfPassport: {
      field: 'passportImageUrl',
      path: './public/images/documents/',
    },
    imageOfGovernmentId: {
      field: 'idCardImageUrl',
      path: './public/images/documents/',
    },
    imageOfDrivingLicense: {
      field: 'drivingLicenseImageUrl',
      path: './public/images/documents/',
    },
    imageOfProfile: {
      field: 'profileImageUrl',
      path: './public/images/users/',
    },
  };

  await Promise.all(
    Object.entries(fileMappings).map(async ([fileKey, { field, path }]) => {
      if (dataFromUser.files[fileKey]) {
        const imageUrl = await saveFileToFolder(
          dataFromUser.files[fileKey][0],
          path
        );
        updateFields[field] = refineUrlAr7(imageUrl);
      }
    })
  );

  if (Object.keys(updateFields).length > 0) {
    await userModelOfMantled.findOneAndUpdate(
      { id: userData.id },
      updateFields
    );
  }

  return sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Profile updated successfully',
    data: {},
  });
});
