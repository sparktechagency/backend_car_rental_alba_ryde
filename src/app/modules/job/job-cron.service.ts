import cron from 'node-cron';
import { logger } from '../../../shared/logger';
import { refreshUserLocationDatabase } from '../../../helpers_v2/location/updateUserLocation.helper';
import { updateTripDatabase } from '../../../helpers_v2/trip/updateTripDatabase.helper';
import { deleteOldTemp } from '../../../helpers_v2/temp/deleteOldTemp';

const assignTechnicianBasedOnAdminCriteria = () => {
  cron.schedule('* * * * *', async () => {
    try {
      refreshUserLocationDatabase();
      updateTripDatabase();
      deleteOldTemp();
    } catch (error) {
      console.log(error);
    }
  });
};

export default assignTechnicianBasedOnAdminCriteria;
