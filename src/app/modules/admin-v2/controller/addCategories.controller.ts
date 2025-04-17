import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { categoriesModel } from '../../categories/model/categories.model';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';

export const addCategoryController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
  const myData = await getDataFromFormOfRequest(req);
  const name = myData.fields.name[0];
  if (!name) {
    throw new Error('Category Name must be provided.');
  }
  const categoryData = await categoriesModel.create({ name });
  const categoryImage = myData.files.image;
  if (categoryImage) {
    const imageUrl = await saveAndGiveRefinedUrl(
      categoryImage[0],
      './public/images/categories'
    );
    await categoriesModel.findOneAndUpdate(
      { id: categoryData.id },
      { imageUrl }
    );
  }

  const myResponse = {
    message: 'Categories Successfully Created',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
