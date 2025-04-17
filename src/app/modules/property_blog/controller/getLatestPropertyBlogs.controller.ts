import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { propertyBlogModel } from '../model/propertyBlog.model';

export const getLatestPropertyBlogsController = myControllerHandler(
  async (req, res) => {
    const { total_number } = req.body;
    const propertyBlogs = await propertyBlogModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(total_number);
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: propertyBlogs,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
