import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { categoriesModel } from '../model/categories.model';

export const getCategoriesController = myControllerHandler(async (req, res) => {
  const categoriesData = await categoriesModel.find();

  const myResponse = {
    message: 'Categories Fetched Successfully',
    success: true,
    data: categoriesData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
