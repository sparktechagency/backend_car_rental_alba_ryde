import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { NotificationModel } from '../model/notification.model';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';

export const getNotificationController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);

    const myResponse = {
      message: 'Data Fetched Successfully',
      success: true,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
