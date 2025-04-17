import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { jwtSecretKey } from '../../data/environmentVariables';
import { checkIfUserRequestingAdmin2 } from '../../helpers/checkIfRequestedUserAdmin';
import { formatDateAr7_2 } from '../others/formatDataAr7_2.helper';

export const getAdminRequestAndGiveSingleUserData = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
      const userId = req.headers.userid;
      const userData = await userModelOfMantled.findOne({ id: userId });
      if (!userData) {
        throw new Error('User does not exists');
      }
      const { fullName, email, phoneNumber, address, createdAt } = userData;
      const joiningDate = formatDateAr7_2(createdAt);
      const dataForClient = {
        fullName,
        email,
        phoneNumber,
        address,
        joiningDate,
      };
      resolve(dataForClient);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
