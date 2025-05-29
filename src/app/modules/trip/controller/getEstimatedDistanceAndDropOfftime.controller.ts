import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getEstimatedDistanceAndTime } from '../../../../helpers_v2/location/getEstimatedDistanceAndTime.helper';
import { addSecondsToDate } from '../../../../helpers_v2/date/addSecondsToDate.helper';

export const getEstimatedDistanceAndDropOffTimeController = myControllerHandler(
  async (req, res) => {
    const {
      pickup_location_longitude,
      pickup_location_latitude,
      dropoff_location_longitude,
      dropoff_location_latitude,
      pickup_time,
    } = req.body;

    const data = await getEstimatedDistanceAndTime(
      pickup_location_latitude,
      pickup_location_longitude,
      dropoff_location_latitude,
      dropoff_location_longitude
    );
    if (data && typeof pickup_time === 'string') {
      const estimatedDropOffTime = addSecondsToDate(
        pickup_time,
        data.time.second
      );
      data.estimatedDropOffTime = estimatedDropOffTime;
    }
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
