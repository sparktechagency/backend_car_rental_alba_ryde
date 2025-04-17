import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest } from '../../../../helpers/getUserDataFromRequest.helper';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { userModelOfMantled } from '../model/userModelOfMantled.model';

export const updateSingleAuthCardController = myControllerHandler(
  async (req, res) => {
    const formData = await getDataFromFormOfRequest(req);
    const userData: any = await getUserDataFromRequest(req);
    console.log(userData);
    const authCardImage = formData.files.auth_card_image;
    if (!authCardImage) {
      throw new Error('please insert image');
    }

    const imageSrc = await saveAndGiveRefinedUrl(
      authCardImage[0],
      './public/images'
    );

    await userModelOfMantled.findOneAndUpdate(
      {
        id: userData.id,
      },
      {
        authCardImageSrc: imageSrc,
        authCardImageApprovalStatus: 'pending',
      }
    );

    const myResponse = {
      message: 'Authcard Added Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
