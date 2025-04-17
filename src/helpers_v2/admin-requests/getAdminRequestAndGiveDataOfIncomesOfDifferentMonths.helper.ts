import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { jwtSecretKey } from '../../data/environmentVariables';
import { checkIfUserRequestingAdmin2 } from '../../helpers/checkIfRequestedUserAdmin';
import { formatNumberAR7 } from '../others/formatNumberAR7';

export const getAdminRequestAndGiveDataOfIncomesOfDifferentMonths = (
  req: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
      const dummyIncomeData = {
        year: 2024,
        incomeData: [
          { month: 'Jan', income: 4500 },
          { month: 'Feb', income: 2200 },
          { month: 'Mar', income: 8240 },
          { month: 'Apr', income: 9600 },
          { month: 'May', income: 9100 },
          { month: 'Jun', income: 9300 },
          { month: 'Jul', income: 9500 },
          { month: 'Aug', income: 5000 },
          { month: 'Sep', income: 2100 },
          { month: 'Oct', income: 8800 },
          { month: 'Nov', income: 9200 },
          { month: 'Dec', income: 8900 },
        ],
      };

      resolve(dummyIncomeData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
