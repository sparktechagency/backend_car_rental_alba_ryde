import { userModel } from '../../app/modules/auth_v2/model/user.model';
import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { jwtSecretKey } from '../../data/environmentVariables';
import { getAndParseJwtTokenFromHeader } from '../../helpers/getAndParseBearerTokenFromHeader';

export const checkIsBanned = (userData: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (userData.isBanned) {
        reject('user is banned');
      } else {
        resolve('user is not banned');
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const checkIsBanned2 = async (req: any) => {
  try {
    let email = req.body?.email;

    if (!email) {
      const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
      email = authData?.email;
    }

    if (!email) {
      throw new Error('email is required for verification');
    }

    const userData = await userModel.findOne({ email });

    if (!userData) {
      throw new Error('user does not exist');
    }

    if (userData.isBanned) {
      throw new Error('user is banned');
    }

    return ''; // Resolves successfully
  } catch (error: any) {
    console.error('Error in checkIsBanned2:', error.message);
    throw error; // Ensures rejection
  }
};

//
