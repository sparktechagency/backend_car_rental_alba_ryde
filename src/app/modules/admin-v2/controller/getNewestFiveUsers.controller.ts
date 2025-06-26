import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { userModel } from '../../auth_v2/model/user.model';
import sendResponse from '../../../../shared/sendResponse';

export const getNewestFiveUsersController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin3(req);
    const usersData = await userModel
      .find({
        role: {
          $in: ['user', 'driver'],
        },
      })
      .sort({
        createdAt: -1,
      })
      .limit(5);
    const refinedData: any = [];
    for (let i = 0; i < usersData.length; i++) {
      const singleData = usersData[i].toObject();
      delete singleData.passwordHash;
      refinedData.push(singleData);
    }

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Latest five users fetched successful',
      data: { refinedData },
    });
  }
);
