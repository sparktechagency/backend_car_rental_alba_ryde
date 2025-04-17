import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';

export const getOwnDataOfUserController = myControllerHandler(
  async (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ message: 'Review Given Successfully', success: true, data: {} });
  }
);
