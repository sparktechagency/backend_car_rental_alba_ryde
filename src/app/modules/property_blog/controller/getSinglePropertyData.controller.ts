import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { propertyBlogModel } from '../model/propertyBlog.model';

export const getSinglePropertyBlogDataController = myControllerHandler(
  async (req, res) => {
    const { id } = req.params;
    const singleData = await propertyBlogModel.findOne({ id });
    if (!singleData) {
      throw new Error('blog does not exist');
    }
    const myResponse = {
      message: 'property data fetched successfull',
      success: true,
      data: singleData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
