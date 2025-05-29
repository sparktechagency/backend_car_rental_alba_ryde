import { TripModel } from '../../app/modules/trip/model/trip.model';
import {
  LIFETIME_OF_PENDING_TRIPS_IN_MINUTES,
  LIFETIME_OF_USER_SEARCH_TRIPS_IN_MINUTES,
} from '../../data/environmentVariables';

export const updateTripDatabase = async () => {
  try {
    const timesAgo = new Date(
      Date.now() - LIFETIME_OF_PENDING_TRIPS_IN_MINUTES * 60 * 1000
    );
    const timesAgo2 = new Date(
      Date.now() - LIFETIME_OF_USER_SEARCH_TRIPS_IN_MINUTES * 60 * 1000
    );

    // Delete pending trips
    const deletePendingResult = await TripModel.deleteMany({
      status: 'pending',
      updatedAt: { $lte: timesAgo },
    });

    if (deletePendingResult.deletedCount > 0) {
      console.log(
        `${deletePendingResult.deletedCount} expired pending trips have been deleted`
      );
    }

    // Delete user_search trips
    const deleteUserSearchResult = await TripModel.deleteMany({
      type: 'user_search',
      updatedAt: { $lte: timesAgo2 },
    });

    if (deleteUserSearchResult.deletedCount > 0) {
      console.log(
        `${deleteUserSearchResult.deletedCount} expired user search trips have been deleted`
      );
    }
  } catch (error) {
    console.error('Error during trip database cleanup:', error);
  }
};
