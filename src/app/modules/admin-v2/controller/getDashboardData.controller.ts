import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { reviewDataModelOfWeatherConsumerReport } from '../../review/model/review.model';
import {
  checkIfUserRequestingAdmin,
  checkIfUserRequestingAdmin2,
} from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { getAdminRequestAndGiveTotalNumberOfUser } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveTotalNumberOfUser.helper';
import { getAdminRequestAndGiveTotalAmountOfIncome } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveTotalAmountOfIncome.helper';
import { getAdminRequestAndGiveDataOfIncomesOfDifferentMonths } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveDataOfIncomesOfDifferentMonths.helper';
import { getAdminRequestAndGiveTotalUserOfDifferentMonths } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveTotalUserOfDifferentMonths.helper';
import { getAdminRequestAndGiveRecentUsers } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveRecentUsers.helper';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const getAdminDashboardDataController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
    const totalNumberOfUser = await getAdminRequestAndGiveTotalNumberOfUser(
      req
    );
    const totalAmountOfEarnings =
      await getAdminRequestAndGiveTotalAmountOfIncome(req);
    const totalAmountOfEarningInDifferentTime =
      await getAdminRequestAndGiveDataOfIncomesOfDifferentMonths(req);

    const usersDataInDifferentTimes =
      await getAdminRequestAndGiveTotalUserOfDifferentMonths(req);

    const recentUsers = await getAdminRequestAndGiveRecentUsers(req);

    const myResponse = {
      message: 'Dashboard Data Fetched Successful',
      success: true,
      totalNumberOfUser,
      totalAmountOfEarnings,
      totalAmountOfEarningInDifferentTime,
      usersDataInDifferentTimes,
      recentUsers,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
