import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import sendResponse from '../../../../shared/sendResponse';

export const getDriversListWithPaginationController = myControllerHandler(
  async (req, res) => {
    // Extract page and limit from query parameters, defaulting to page 1 and limit 10 if not provided
    const { page = '1', limit = '10' } = req.query;
    const refinedPage = Number(page);
    const refinedLimit = Number(limit);
    const numbersToSkip = (refinedPage - 1) * refinedLimit;

    // Fetch users with pagination
    const totalUsers = await userModel.countDocuments({ role: 'driver' }); // Total number of users
    const users = await userModel
      .find({
        role: 'driver',
      })
      .skip(numbersToSkip) // Skip the documents based on the page
      .limit(refinedLimit); // Limit the number of documents per page

    const totalNumberOfPages = Math.ceil(totalUsers / refinedLimit); // Calculate the total number of pages

    // Prepare the response

    // Send the response

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Users List Fetched Successfully',
      data: {
        currentPage: refinedPage,
        totalNumberOfItems: totalUsers,
        totalNumberOfPages,
        data: users,
      },
    });
  }
);
