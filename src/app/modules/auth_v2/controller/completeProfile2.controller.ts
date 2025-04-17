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

export const completeProfile2Controller = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const tokenData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const formData = await getDataFromFormOfRequest(req);
    const { email } = tokenData;
    const { files } = formData;
    const passportImage = files.passportImage;
    const governmentIdImage = files.governmentIdImage;
    const drivingLicenseImage = files.drivingLicenseImage;

    // save image if image exists
    if (passportImage && passportImage.size !== 0) {
      const imageUrl = await saveFileToFolder(
        passportImage[0],
        './public/images/user_images/'
      );
      const refinedImageUrl = refineUrlAr7(imageUrl);
      await userModelOfMantled.findOneAndUpdate(
        { email },
        { passportImageUrl: refinedImageUrl }
      );
    }
    if (governmentIdImage && governmentIdImage.size !== 0) {
      const imageUrl = await saveFileToFolder(
        governmentIdImage[0],
        './public/images/user_images/'
      );
      const refinedImageUrl = refineUrlAr7(imageUrl);
      await userModelOfMantled.findOneAndUpdate(
        { email },
        { idCardImageUrl: refinedImageUrl }
      );
    }
    if (drivingLicenseImage && drivingLicenseImage.size !== 0) {
      const imageUrl = await saveFileToFolder(
        drivingLicenseImage[0],
        './public/images/user_images/'
      );
      const refinedImageUrl = refineUrlAr7(imageUrl);
      await userModelOfMantled.findOneAndUpdate(
        { email },
        { drivingLicenseImageUrl: refinedImageUrl }
      );
    }
    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Profile Updated Successfully',
      data: {},
    });
  }
);
