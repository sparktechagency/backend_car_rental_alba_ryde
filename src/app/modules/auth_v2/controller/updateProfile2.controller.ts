import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { getUserDataFromRequest } from '../../../../helpers/getUserDataFromRequest.helper';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import {
  JWT_SECRET_KEY,
  PATH_OF_USER_PROFILE_PICTURE_FOLDER,
} from '../../../../data/environmentVariables';
import { userModel } from '../model/user.model';
import { giveAuthenticationToken } from '../../../../helpers/jwtAR7';

export const updateProfileController2 = myControllerHandler(
  async (req, res) => {
    const userData: any = await getUserDataFromRequest(req);
    const myData = await getDataFromFormOfRequest(req);
    const { fields, files } = myData;
    const { new_name, new_email, new_phone_number } = fields;
    const { new_profile_picture } = files;
    if (new_name) {
      userData.name = new_name[0];
    }
    if (new_email) {
      userData.email = new_email[0];
    }
    if (new_phone_number) {
      userData.phone = new_phone_number[0];
    }

    if (new_profile_picture) {
      const newImageUrl = await saveAndGiveRefinedUrl(
        new_profile_picture[0],
        PATH_OF_USER_PROFILE_PICTURE_FOLDER
      );
      userData.profilePictureUrl = newImageUrl;
    }

    await userData.save();
    const updatedData = await userModel.findOne({ id: userData.id });
    const newEmail = updatedData?.email as string;
    const newAuthToken = await giveAuthenticationToken(
      newEmail,
      JWT_SECRET_KEY
    );

    const myResponse = {
      message: 'Profile updated successfully',
      success: true,
      data: updatedData,
      token: newAuthToken,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
