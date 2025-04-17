import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAdminRequestAndGiveSingleUserData } from '../../../../helpers_v2/admin-requests/getAdminRequestAndGiveSingleUserData.helper';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { formatDateAr7_2 } from '../../../../helpers_v2/others/formatDataAr7_2.helper';
import { JWT_SECRET_KEY } from '../../../../data/environmentVariables';

export const getSingleUserDataController2 = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, JWT_SECRET_KEY, userModelOfMantled);
    const { id } = req.params;
    console.log({ id });
    const userId = id;
    const userData = await userModelOfMantled.findOne({ id: userId });
    if (!userData) {
      throw new Error('User does not exists');
    }
    const refinedUserData = userData.toObject();

    // const joiningDate = formatDateAr7_2(refinedUserData.createdAt);
    refinedUserData.passwordHash = '';

    const myResponse = {
      message: `User's data fetched successfully`,
      success: true,
      data: refinedUserData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
