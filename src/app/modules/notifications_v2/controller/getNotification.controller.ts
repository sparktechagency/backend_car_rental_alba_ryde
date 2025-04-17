import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { NotificationModel } from '../model/notification.model';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const getNotificationController = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = authData;

    const userData = await userModelOfMantled.findOne({ email });
    if (!userData) {
      throw new Error('User does not exist');
    }

    const notificationsData = await NotificationModel.find({
      userId: userData.id,
    })
      .sort({ createdAt: -1 }) // Sorts by createdAt in descending order (newest first)
      .limit(10);

    const myResponse = {
      message: 'Data Fetched Successfully',
      success: true,
      notifications: notificationsData, // Ensure correct key name in response
    };

    res.status(StatusCodes.OK).json(myResponse);
  }
);
