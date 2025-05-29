import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { CarModel } from '../model/car.model';
import { generateRandomCarData } from '../../../../helpers_v2/car/generateRandomCarInfo.helper';

export const populateCarController = myControllerHandler(async (req, res) => {
  const usersData = await userModel.find({});

  for (let i = 0; i < usersData.length; i++) {
    const singleData = usersData[i];
    const carData = await CarModel.findOne({
      ownerId: singleData.id,
    });
    if (!carData) {
      const randomCarData = generateRandomCarData();
      await CarModel.create({
        ownerId: singleData.id,
        carBrand: randomCarData.carBrand,
        carModel: randomCarData.carModel,
        yearOfManufacture: randomCarData.yearOfManufacture,
        licensePlate: randomCarData.licensePlate,
        carType: randomCarData.carType,
        approvedPricePerHour: randomCarData.approvedPricePerHour,
        approvedPricePerKilometer: randomCarData.pricePerKilometer,
      });
    }
  }

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
