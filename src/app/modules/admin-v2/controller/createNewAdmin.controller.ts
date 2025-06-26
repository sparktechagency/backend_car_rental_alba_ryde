import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { userModel } from '../../auth_v2/model/user.model';

export const createNewAdminController = myControllerHandler(
  async (req, res) => {
    const { name, email, password } = req.body;
    const passwordHash = await hashMyPassword(password);
    const userData = await userModel.create({
      name: name,
      email: email,
      passwordHash: passwordHash,
      role: 'admin',
    });

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Review Given Successfully',
      data: {
        userData,
      },
    });
  }
);
