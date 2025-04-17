import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';

export const getDataOfUsersController = myControllerHandler(
  async (req, res) => {
    let { from, to } = req.body;
    from = Number(from);
    to = Number(to);

    // Ensure valid range for 'from' and 'to'
    if (isNaN(from) || isNaN(to) || from < 0 || to < 0 || from >= to) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'Invalid range for "from" and "to"',
        success: false,
      });
    }

    // Get users data with pagination (skip and limit)
    const usersData = await userModel
      .find({
        role: 'user',
      })
      .sort({ createdAt: -1 }) // Sort by most recent
      .skip(from) // Skip the first 'from' number of records
      .limit(to - from); // Limit the number of records to (to - from)

    const myResponse = {
      message: 'Users fetched successfully',
      success: true,
      data: usersData,
    };

    res.status(StatusCodes.OK).json(myResponse);
  }
);
