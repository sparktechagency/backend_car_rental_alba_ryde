import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { jwtSecretKey } from '../../data/environmentVariables';
import { checkIfUserRequestingAdmin2 } from '../../helpers/checkIfRequestedUserAdmin';
import { formatNumberAR7 } from '../others/formatNumberAR7';

export const getAdminRequestAndGiveTotalAmountOfIncome = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
      const dummyIncome: any = { amount: 2000, currency: 'usd' };
      dummyIncome.amount = formatNumberAR7(dummyIncome.amount);
      resolve(dummyIncome);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
