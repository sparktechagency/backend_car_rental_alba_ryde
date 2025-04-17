import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { categoriesModel } from '../model/categories.model';

export const deleteCategoryController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin(req, jwtSecretKey);
    const { id } = req.params;

    const categoryData = await categoriesModel.findOne({ id });

    if (!categoryData) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: 'This category does not exists' });
    }

    await categoryData.deleteOne();

    const myResponse = {
      message: 'Category Deleted Successfull',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
