import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { NotificationModel } from '../../app/modules/notifications_v2/model/notification.model';
import { jwtSecretKey } from '../../data/environmentVariables';
import { checkIfUserRequestingAdmin2 } from '../../helpers/checkIfRequestedUserAdmin';

export const getAdminRequestAndGiveNotifications = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);

      const notifications = await NotificationModel.find({
        type: 'for_admin',
      })
        .sort({ createdAt: -1 }) // Sort newest first
        .limit(20);

      resolve(notifications);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
