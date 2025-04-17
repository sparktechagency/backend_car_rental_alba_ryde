import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAdminRequestAndGiveTotalNumberOfUser } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveTotalNumberOfUser.helper';
import { getAdminRequestAndGiveTotalUserOfDifferentMonths } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveTotalUserOfDifferentMonths.helper';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { JWT_SECRET_KEY } from '../../../../data/environmentVariables';

export const getUserRatioOfDifferentMonthsController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, JWT_SECRET_KEY, userModelOfMantled);
    const usersDataInDifferentTimes =
      await getAdminRequestAndGiveTotalUserOfDifferentMonths(req);
    const myResponse = {
      message: 'Total Number of User fetched Successfully.',
      success: true,
      usersDataInDifferentTimes,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
