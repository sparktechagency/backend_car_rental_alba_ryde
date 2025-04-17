import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { saveFileToFolder } from '../../../../helpers/uploadFilesToFolder';
import refineUrlAr7 from '../../../../helpers/refineUrlAr7';
import { userModelOfMantled } from '../model/userModelOfMantled.model';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const completeProfile1Controller = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const tokenData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const formData = await getDataFromFormOfRequest(req);
    const { files, fields } = formData;
    const dateOfBirth = fields.dateOfBirth[0];
    const occupation = fields.occupation[0];
    const maritalStatus = fields.maritalStatus[0];
    const { email } = tokenData;
    const profileImage = files.profileImage;

    // update userdata
    await userModelOfMantled.findOneAndUpdate(
      { email },
      {
        dateOfBirth,
        occupation,
        maritalStatus,
      }
    );

    // save image if image exists
    if (profileImage && profileImage.size !== 0) {
      const imageUrl = await saveFileToFolder(
        profileImage[0],
        './public/images/user_images/'
      );
      const refinedImageUrl = refineUrlAr7(imageUrl);
      await userModelOfMantled.findOneAndUpdate(
        { email },
        { profileImageUrl: refinedImageUrl }
      );
    }
    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Profile Updated Successfully',
      data: {},
    });
  }
);
