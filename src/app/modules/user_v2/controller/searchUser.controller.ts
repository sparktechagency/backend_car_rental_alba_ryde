import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';

export const searchUserController = myControllerHandler(async (req, res) => {
  const { search_text } = req.params;
  const userData = await userModel.find({
    $or: [
      { name: { $regex: search_text, $options: 'i' } },
      { email: { $regex: search_text, $options: 'i' } },
    ],
  });

  const myResponse = {
    message: 'Userdata fetched successful',
    success: true,
    data: userData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
