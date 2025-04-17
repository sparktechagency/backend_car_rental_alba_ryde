import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';

import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { categoriesModel } from '../../categories/model/categories.model';

export const updateCategoryController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);

    const myData = await getDataFromFormOfRequest(req);
    const id = myData.fields.id[0];
    const name = myData.fields.name;
    const categoryImage = myData.files.image;
    if (name) {
      await categoriesModel.findOneAndUpdate({ id }, { name: name[0] });
    }

    if (categoryImage) {
      const imageUrl = await saveAndGiveRefinedUrl(
        categoryImage[0],
        './public/images/categories'
      );
      await categoriesModel.findOneAndUpdate({ id }, { imageUrl });
    }

    const myResponse = {
      message: 'Categories Successfully Updated',
      success: true,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
