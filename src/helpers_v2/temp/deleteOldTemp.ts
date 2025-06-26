import { TempModel } from '../../app/modules/admin-v2/model/invoiceRequest.model';

export const deleteOldTemp = async () => {
  const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000); // 3 hours in milliseconds
  await TempModel.deleteMany({
    createdAt: { $lt: threeHoursAgo },
  });
};
