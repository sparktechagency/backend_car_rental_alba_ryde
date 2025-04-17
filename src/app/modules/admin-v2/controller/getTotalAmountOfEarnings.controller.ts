import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAdminRequestAndGiveTotalAmountOfIncome } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveTotalAmountOfIncome.helper';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { JWT_SECRET_KEY } from '../../../../data/environmentVariables';

export const getTotalAmountOfEarningsController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, JWT_SECRET_KEY, userModelOfMantled);
    const totalAmountOfEarnings =
      await getAdminRequestAndGiveTotalAmountOfIncome(req);

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      totalEarnings: totalAmountOfEarnings,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
