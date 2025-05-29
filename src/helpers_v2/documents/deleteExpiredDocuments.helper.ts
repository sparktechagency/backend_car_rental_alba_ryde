import mongoose from 'mongoose';

export const deleteExpiredDocuments = async (
  model: mongoose.Model<any>,
  lifetimeInMinutes: number,
  name: string
) => {
  try {
    const expiryDate = new Date(Date.now() - lifetimeInMinutes * 60 * 1000);
    const expiredCount = await model.countDocuments({
      updatedAt: { $lte: expiryDate },
    });

    if (expiredCount > 0) {
      await model.deleteMany({
        updatedAt: { $lte: expiryDate },
      });
      console.log(`${expiredCount} expired ${name} have been deleted`);
    }
  } catch (error) {
    console.error('Error deleting expired documents:', error);
  }
};
