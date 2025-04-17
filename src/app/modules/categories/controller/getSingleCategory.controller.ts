import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { categoriesModel } from '../model/categories.model';

export const getSingleCategoryController = myControllerHandler(
  async (req, res) => {
    const { id } = req.params;
    const categoriesData = await categoriesModel.findOne({ id });

    const myResponse = {
      message: 'Single Category Fetched Successfully',
      success: true,
      data: categoriesData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
