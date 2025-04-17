import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { jwtSecretKey } from '../../data/environmentVariables';
import { checkIfUserRequestingAdmin2 } from '../../helpers/checkIfRequestedUserAdmin';
import { getAndParseTokenFromHeader2 } from '../../helpers/getAndParseBearerTokenFromHeader';

export const getAdminRequestAndGiveTotalNumberOfUser = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
      const totalNumberOfUser = await userModelOfMantled.countDocuments({
        role: { $ne: 'admin' },
      });
      resolve(totalNumberOfUser);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
