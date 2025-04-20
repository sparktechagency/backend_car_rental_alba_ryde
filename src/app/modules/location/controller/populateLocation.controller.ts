import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { LocationModel } from '../model/location.model';

// Function to generate random coordinates within a specific range
const generateRandomCoordinates = () => {
  const minLat = 40.0; // minimum latitude
  const maxLat = 41.0; // maximum latitude
  const minLon = -74.0; // minimum longitude
  const maxLon = -73.0; // maximum longitude

  const latitude = (Math.random() * (maxLat - minLat) + minLat).toFixed(6); // Random latitude between minLat and maxLat
  const longitude = (Math.random() * (maxLon - minLon) + minLon).toFixed(6); // Random longitude between minLon and maxLon

  return [parseFloat(longitude), parseFloat(latitude)]; // Return as [longitude, latitude]
};

export const populateLocationController = myControllerHandler(
  async (req, res) => {
    const userData = await userModel.find({});

    // Loop through all users
    for (let i = 0; i < userData.length; i++) {
      try {
        const singleUserId = userData[i].id;
        const randomCoordinates = generateRandomCoordinates();
        await LocationModel.create({
          userId: singleUserId,
          location: { type: 'Point', coordinates: randomCoordinates },
        });
      } catch (error) {
        console.log(error);
      }
    }

    const myResponse = {
      message: 'Locations populated successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
