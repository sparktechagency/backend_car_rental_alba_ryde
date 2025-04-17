import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { fakeNameAndEmail } from '../../../../data/dummy_data/fakeNameAndEmail';

export const populateUserController = myControllerHandler(async (req, res) => {
  for (let i = 0; i < fakeNameAndEmail.length; i++) {
    const singleData = fakeNameAndEmail[i];
    const { name, email } = singleData;
    await userModel.create({
      name,
      email,
      passwordHash:
        '$2a$10$F01QooaQ9kPBeNYNL4rYE.kSwvJI.R987aOowfHHeVHyrss90zP2i',
      role: 'user',
    });
  }

  const myResponse = {
    message: 'User Populated Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});

// $2a$10$F01QooaQ9kPBeNYNL4rYE.kSwvJI.R987aOowfHHeVHyrss90zP2i
