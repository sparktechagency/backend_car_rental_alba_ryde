import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { TripModel } from '../../trip/model/trip.model';

export const getWithdrawRequestDetailsController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin3(req);
    const { idOfTrips } = req.body;
    const firstTripData = await TripModel.findOne();

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
