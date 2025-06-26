import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';
import sendResponse from '../../../../shared/sendResponse';

export const getSingleUserDetailsController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin3(req);
    const { userId } = req.query;
    const userData = await userModel.findOne({ id: userId });
    if (!userData) {
      throw new Error('user does not exist with this id');
    }
    const refinedData = userData.toObject();
    delete refinedData.passwordHash;
    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Review Given Successfully',
      data: { userData: refinedData },
    });
  }
);
