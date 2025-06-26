import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { userModel } from '../../auth_v2/model/user.model';
import { PaymentModel } from '../../payment_v2/model/payment.model';

export const getTotalUsersTotalIncomeAndUserAndDriverRatioController =
  myControllerHandler(async (req, res) => {
    // Check if the user requesting is an admin
    await checkIfUserRequestingAdmin3(req);

    // Get the total number of users with role 'user'
    const totalUsers = await userModel.countDocuments({
      role: 'user',
    });
    const totalDrivers = await userModel.countDocuments({
      role: 'driver',
    });
    const totalPeople = totalUsers + totalDrivers;

    // Calculate the percentages for users and drivers, avoiding division by zero
    const userPercentage =
      totalPeople > 0 ? (totalUsers / totalPeople) * 100 : 0;
    const driverPercentage =
      totalPeople > 0 ? (totalDrivers / totalPeople) * 100 : 0;

    // Aggregate the total income by summing the 'amount' fields
    const totalIncomeResult = await PaymentModel.aggregate([
      {
        $group: {
          _id: null, // We don't need to group by anything, just get the total sum
          totalIncome: { $sum: '$amount' }, // Sum the 'amount' field
        },
      },
    ]);
    console.log(totalIncomeResult);
    let totalIncome =
      totalIncomeResult.length > 0 ? totalIncomeResult[0].totalIncome : 0;
    totalIncome = totalIncome / 100;

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Data retrieved successfully',
      data: {
        totalUsers,
        totalIncome,
        userPercentage,
        driverPercentage,
        // Send the total income in the response
        // Include the ratio or other data as needed
      },
    });
  });
