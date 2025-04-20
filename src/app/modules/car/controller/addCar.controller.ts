import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { CarModel } from '../model/car.model';

export const addCarController = myControllerHandler(async (req, res) => {
  const userData: any = await getUserDataFromRequest2(req);
  const { carBrand, carModel, yearOfManufacture, licensePlate, carType } =
    req.body;

  await CarModel.create({
    ownerId: userData.id,
    carBrand,
    carModel,
    yearOfManufacture,
    licensePlate,
    carType,
  });

  const myResponse = {
    message: 'car added successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
