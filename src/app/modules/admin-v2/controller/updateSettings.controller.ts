import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { getUserDataFromRequest } from '../../../../helpers/getUserDataFromRequest.helper';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';

export const updateSettingsController = myControllerHandler(
  async (req, res) => {
    const userData: any = await getUserDataFromRequest(req);
    const dataFromUser = await getDataFromFormOfRequest(req);
    const dataToSave: any = {};
    const newName = dataFromUser.fields.new_name;
    if (newName) {
      dataToSave.fullName = newName[0];
    }
    const newEmail = dataFromUser.fields.new_email;
    if (newEmail) {
      dataToSave.email = newEmail[0];
    }
    const newPhoneNumber = dataFromUser.fields.new_phone_number;
    if (newPhoneNumber) {
      dataToSave.phoneNumber = newPhoneNumber[0];
    }
    const newProfileImage = dataFromUser.files.new_profile_image;
    if (newProfileImage) {
      dataToSave.profileImageUrl = await saveAndGiveRefinedUrl(
        newProfileImage[0],
        './public/images/user_images'
      );
    }
    await userModelOfMantled.findOneAndUpdate({ id: userData.id }, dataToSave);

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
userModelOfMantled;
