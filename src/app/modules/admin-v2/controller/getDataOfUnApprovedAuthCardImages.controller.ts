import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest } from '../../../../helpers/getUserDataFromRequest.helper';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const getDataOfUnapprovedAuthCardImagesController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest(req);
    const myData = await userModelOfMantled.find({
      authCardImageSrc: { $nin: [null, ''] }, // Exclude null and empty string
      authCardImageApprovalStatus: 'pending',
    });
    const dataForClient = [];
    for (let i = 0; i < myData.length; i++) {
      const singleData = myData[i];
      const {
        id,
        authCardImageSrc,
        authCardImageApprovalStatus,
        fullName,
        profileImageUrl,
        email,
      } = singleData;
      const singleDataOfClient = {
        userId: id,
        authCardImageSrc,
        authCardImageApprovalStatus,
        fullName,
        profileImageUrl,
        email,
      };
      dataForClient.push(singleDataOfClient);
    }

    const myResponse = {
      message: 'Auth Card',
      success: true,
      data: dataForClient,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
