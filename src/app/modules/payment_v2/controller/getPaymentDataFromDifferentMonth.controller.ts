import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { PaymentModel } from '../model/payment.model';
import mongoose from 'mongoose';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';

export const getPaymentDataOfDifferentMonthsController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin3(req);
    const currentYear = new Date().getFullYear();

    // Aggregate the payments by month for the current year
    const paymentsData = await PaymentModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00Z`),
          },
        },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          amount: 1,
        },
      },
      {
        $group: {
          _id: '$month',
          totalAmount: { $sum: '$amount' },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month in ascending order
      },
    ]);

    // Prepare the data in the desired format
    const chartData = [
      { name: 'January', amount: 0 },
      { name: 'February', amount: 0 },
      { name: 'March', amount: 0 },
      { name: 'April', amount: 0 },
      { name: 'May', amount: 0 },
      { name: 'June', amount: 0 },
      { name: 'July', amount: 0 },
      { name: 'August', amount: 0 },
      { name: 'September', amount: 0 },
      { name: 'October', amount: 0 },
      { name: 'November', amount: 0 },
      { name: 'December', amount: 0 },
    ];

    // Map the aggregated data to the chart format
    paymentsData.forEach(payment => {
      const monthIndex = payment._id - 1; // 0-based index for months
      chartData[monthIndex].amount = payment.totalAmount / 100;
    });

    // Send the response with the chart data
    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Payment data retrieved successfully',
      data: chartData,
    });
  }
);
