import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAdminRequestAndGiveNotifications } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveNotifications.helper';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const getNotificationsForAdminController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
    const notifications = await getAdminRequestAndGiveNotifications(req);
    console.log(notifications);
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      notifications,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
