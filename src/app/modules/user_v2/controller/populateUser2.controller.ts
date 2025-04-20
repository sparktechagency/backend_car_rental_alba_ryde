import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModel } from '../../auth_v2/model/user.model';
import { fakeNameAndEmail } from '../../../../data/dummy_data/fakeNameAndEmail';

const getRandomLocation = () => {
  // Generate random latitude and longitude within a specified range (e.g., 40.0 to 41.0 for latitude, -74.0 to -73.0 for longitude)
  const latitude = Math.random() * 2 + 40; // Random latitude between 40.0 and 42.0
  const longitude = Math.random() * 2 - 74; // Random longitude between -74.0 and -72.0

  return [longitude, latitude]; // GeoJSON format [longitude, latitude]
};

export const populateUserController2 = myControllerHandler(async (req, res) => {
  for (let i = 0; i < fakeNameAndEmail.length; i++) {
    const singleData = fakeNameAndEmail[i];
    const { name, email } = singleData;

    // Randomly assign the role (either 'user' or 'driver', but not 'admin')
    const role = Math.random() < 0.5 ? 'user' : 'driver'; // 50% chance for either 'user' or 'driver'

    // Get a random location
    const location = getRandomLocation();

    // Create user with role and location
    await userModel.create({
      name,
      email,
      passwordHash:
        '$2a$10$F01QooaQ9kPBeNYNL4rYE.kSwvJI.R987aOowfHHeVHyrss90zP2i',
      role,
      location: {
        type: 'Point',
        coordinates: location,
      },
    });
  }

  const myResponse = {
    message: 'User Populated Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
