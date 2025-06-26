import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';
import { TripModel } from '../model/trip.model';

export const getBookedTripController = myControllerHandler(async (req, res) => {
  const { page = '1', limit = '10' } = req.query;
  const refinedPage = Number(page);
  const refinedLimit = Number(limit);
  const numbersToSkip = (refinedPage - 1) * refinedLimit;

  const userData = await getUserDataFromRequest2(req);

  // Filter for booked trips with accepted status for the driver
  const filter = {
    driverId: userData.id,
    type: 'booked',
    status: 'accepted',
  };

  // Count total matching documents
  const totalRequests = await TripModel.countDocuments(filter);

  // Find booked trips with pagination and sorting by pickupTime descending (newest first)
  const bookedTripData = await TripModel.find(filter)
    .skip(numbersToSkip)
    .limit(refinedLimit)
    .sort({
      createdAt: -1,
    });

  const totalNumberOfPages = Math.ceil(totalRequests / refinedLimit);

  const myResponse = {
    message: 'Booked Trips Fetched Successfully',
    success: true,
    currentPage: refinedPage,
    totalNumberOfItems: totalRequests,
    totalNumberOfPages,
    data: bookedTripData,
  };

  res.status(StatusCodes.OK).json(myResponse);
});
