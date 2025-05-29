import { userModel } from '../app/modules/auth_v2/model/user.model';
import { userModelOfMantled } from '../app/modules/auth_v2/model/userModelOfMantled.model';
import { JWT_SECRET_KEY, jwtSecretKey } from '../data/environmentVariables';
import { getAndParseJwtTokenFromHeader } from './getAndParseBearerTokenFromHeader';
type fType = (req: any) => any;
export const getUserDataFromRequest = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authData = await getAndParseJwtTokenFromHeader(req, JWT_SECRET_KEY);
      const { email } = authData;
      const userData = await userModel.findOne({ email });
      if (!userData) {
        throw new Error('USER_DOES_NOT_EXISTS');
      }
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const getUserDataFromRequest2: fType = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authData = await getAndParseJwtTokenFromHeader(req, JWT_SECRET_KEY);
      const { userId } = authData;

      const userData = await userModel.findOne({ id: userId });
      if (!userData) {
        throw new Error('USER_DOES_NOT_EXISTS');
      }
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const getUserDataFromRequestIfAny = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        resolve(null);
        return;
      }
      const authData = await getAndParseJwtTokenFromHeader(req, JWT_SECRET_KEY);
      const { email } = authData;
      const userData = await userModel.findOne({ email });
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
