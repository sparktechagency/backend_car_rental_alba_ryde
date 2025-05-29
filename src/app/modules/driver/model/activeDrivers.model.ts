// import mongoose from 'mongoose';
// import { ar7id } from '../../../../helpers/ar7Id';

// const activeDriverSchema = new mongoose.Schema(
//   {
//     id: {
//       type: String,
//       required: true,
//       unique: true,
//       default: () => 'active_driver_' + ar7id(),
//     },
//     userId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     location: {
//       type: { type: String, default: 'Point', enum: ['Point'] },
//       coordinates: { type: [Number], required: true, default: [0, 0] },
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Create a 2dsphere index on the location field for geospatial queries
// activeDriverSchema.index({ location: '2dsphere' });

// export const LocationModel = mongoose.model('active', locationSchema);
