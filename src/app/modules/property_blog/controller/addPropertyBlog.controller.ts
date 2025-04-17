import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { propertyBlogModel } from '../model/propertyBlog.model';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';

export const addPropertyBlogController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin3(req);
    const propertyData = await getDataFromFormOfRequest(req);
    const { fields, files } = propertyData;
    const { name, description } = fields;
    const { images } = files;
    if (!name) {
      throw new Error('please enter name');
    }
    if (!description) {
      throw new Error('please enter description');
    }
    if (!images) {
      throw new Error('please give atleast one image');
    }

    const arrayOfImagesSrc: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const singleImage = images[i];
      const imageUrl = await saveAndGiveRefinedUrl(
        singleImage,
        './public/images/property-blog'
      );
      arrayOfImagesSrc.push(imageUrl);
    }

    const savedPostData = await propertyBlogModel.create({
      name: name[0],
      description: description[0],
      images: arrayOfImagesSrc,
    });

    const myResponse = {
      message: 'Blog uploaded successfully',
      success: true,
      data: savedPostData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
