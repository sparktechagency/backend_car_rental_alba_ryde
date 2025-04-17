import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { propertyBlogModel } from '../model/propertyBlog.model';

export const getPropertyBlogsController = myControllerHandler(
  async (req, res) => {
    const propertyBlogs = await propertyBlogModel
      .find({})
      .sort({ createdAt: -1 });
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: propertyBlogs,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
