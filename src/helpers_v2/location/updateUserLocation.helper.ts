import { LocationModel } from '../../app/modules/location/model/location.model';
import { LIFETIME_OF_LOCATION_DATA_IN_MINUTES } from '../../data/environmentVariables';

export const refreshUserLocationDatabase = async () => {
  try {
    const timesAgo = new Date(
      Date.now() - LIFETIME_OF_LOCATION_DATA_IN_MINUTES * 60 * 1000
    );
    const numberOfExpiredLocation = await LocationModel.countDocuments({
      updatedAt: { $lte: timesAgo },
    });

    if (numberOfExpiredLocation > 0) {
      await LocationModel.deleteMany({
        updatedAt: { $lte: timesAgo },
      });
      console.log(
        `${numberOfExpiredLocation} expired locations has been deleted`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
