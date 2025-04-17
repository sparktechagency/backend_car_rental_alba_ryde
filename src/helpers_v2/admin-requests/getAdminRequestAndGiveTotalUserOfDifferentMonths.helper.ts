import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { jwtSecretKey } from '../../data/environmentVariables';
import { checkIfUserRequestingAdmin2 } from '../../helpers/checkIfRequestedUserAdmin';

export const getAdminRequestAndGiveTotalUserOfDifferentMonths = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);

      // Aggregate users by month (excluding admins)
      const userCountByMonth = await userModelOfMantled.aggregate([
        {
          $match: { role: { $ne: 'admin' } }, // Exclude admins
        },
        {
          $group: {
            _id: { month: { $month: '$createdAt' } }, // Group by month
            users: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } }, // Count "user"
            collaborators: {
              $sum: { $cond: [{ $eq: ['$role', 'collaborator'] }, 1, 0] },
            }, // Count "collaborator"
          },
        },
        {
          $sort: { '_id.month': 1 }, // Sort by month (1 = Jan, 12 = Dec)
        },
      ]);

      // Convert the result into a readable format with month names
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const formattedData = userCountByMonth.map(data => ({
        month: monthNames[data._id.month - 1], // Convert month number to name
        users: data.users,
        collaborators: data.collaborators,
      }));

      resolve(formattedData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
