import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { propertyBlogModel } from '../model/propertyBlog.model';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';

export const updatePropertyBlogController = myControllerHandler(
  async (req, res) => {
    const myFormData = await getDataFromFormOfRequest(req);
    const { fields, files } = myFormData;
    const { id, new_name, new_description } = fields;
    const { new_image } = files;
    if (!id) {
      throw new Error('please give id');
    }
    const blogData = await propertyBlogModel.findOne({ id });

    if (!blogData) {
      throw new Error('blog does not exist with this id');
    }

    if (new_name) {
      blogData.name = new_name[0];
    }
    if (new_description) {
      blogData.description = new_description[0];
    }
    if (new_image) {
      const newImageSrc = await saveAndGiveRefinedUrl(
        new_image[0],
        './public/images/property-blog'
      );
      blogData.images[0] = newImageSrc;
    }

    await blogData.save();
    const updatedBlogData = await propertyBlogModel.findOne({ id });

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: updatedBlogData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
