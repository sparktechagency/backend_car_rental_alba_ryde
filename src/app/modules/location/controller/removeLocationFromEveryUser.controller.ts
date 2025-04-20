import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';

export const removeLocationFromUserController = myControllerHandler(
  async (req, res) => {
    // 1. Fetch all users
    const users = await userModel.find({});

    // 2. Remove the 'location' field from each user
    const usersWithoutLocation = users.map(user => {
      const userObj: any = user.toObject(); // Convert to plain JS object
      delete userObj.location; // Remove the location field
      return userObj;
    });

    // 3. Delete all existing users
    await userModel.deleteMany({});

    // 4. Re-insert the modified users (without location)
    await userModel.insertMany(usersWithoutLocation);

    const myResponse = {
      message: 'All users recreated without the location field',
      success: true,
      data: { modifiedCount: users.length },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
