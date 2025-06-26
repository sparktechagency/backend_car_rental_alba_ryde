import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { CarModel } from '../../car/model/car.model';

export const changeOwnCarModelController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const { carType } = req.body;
    const carData = await CarModel.findOne({ ownerId: userData.id });
    if (!carData) {
      throw new Error('car of this user does not exist');
    }
    carData.carType = carType;
    await carData.save();
    const myResponse = {
      message: 'car updated successfully',
      success: true,
      data: {
        carData,
      },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
