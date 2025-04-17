import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { userDataModelOfWeatherConsumerReport } from '../../user/userModelOfWeatherConsumerReport.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const banUserController2 = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin(req, jwtSecretKey);
  const { id } = req.params;
  console.log(req.params);
  await userModelOfMantled.findOneAndUpdate(
    { id: id },
    {
      isBanned: true,
    }
  );
  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'User Banned Successfully',
    data: {},
  });
});
