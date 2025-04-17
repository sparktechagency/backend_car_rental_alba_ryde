import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { jwtSecretKey } from '../../data/environmentVariables';
import { checkIfUserRequestingAdmin2 } from '../../helpers/checkIfRequestedUserAdmin';
import { formatDateAr7_2 } from '../others/formatDataAr7_2.helper';
import { formatNumberAR7 } from '../others/formatNumberAR7';

export const getAdminRequestAndGiveRecentUsers = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);

      // Find the latest 10 users, excluding admins
      const recentUsersData: any = await userModelOfMantled
        .find(
          { role: { $ne: 'admin' } } // Exclude admins
        )
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(10) // Get only the latest 10 users
        .select(
          'fullName email phoneNumber role createdAt id profileImageUrl phoneNumber'
        ); // Select relevant fields

      const arrayOfModifiedData = [];
      for (let i = 0; i < recentUsersData.length; i++) {
        const refinedData = recentUsersData[i].toObject();
        refinedData.createdAt = formatDateAr7_2(refinedData.createdAt);
        arrayOfModifiedData.push(refinedData);
      }

      resolve(arrayOfModifiedData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
