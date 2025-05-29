import cron from 'node-cron';
import { logger } from '../../../shared/logger';
import { refreshUserLocationDatabase } from '../../../helpers_v2/location/updateUserLocation.helper';
import { updateTripDatabase } from '../../../helpers_v2/trip/updateTripDatabase.helper';

const assignTechnicianBasedOnAdminCriteria = () => {
  cron.schedule('* * * * *', async () => {
    try {
      refreshUserLocationDatabase();
      updateTripDatabase();
    } catch (error) {
      console.log(error);
    }
  });
};

export default assignTechnicianBasedOnAdminCriteria;
