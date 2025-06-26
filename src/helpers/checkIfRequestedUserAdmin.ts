import { Request } from 'express';
import { getAndParseJwtTokenFromHeader } from './getAndParseBearerTokenFromHeader';
import { userDataModelOfWeatherConsumerReport } from '../app/modules/user/userModelOfWeatherConsumerReport.model';
import { userModelOfMantled } from '../app/modules/auth_v2/model/userModelOfMantled.model';
import { JWT_SECRET_KEY } from '../data/environmentVariables';
import { userModel } from '../app/modules/auth_v2/model/user.model';

export const checkIfUserRequestingAdmin = (
  req: Request,
  jwtSecretKey: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
      const { email } = parsedData;
      const userData = await userModelOfMantled.findOne({
        email,
      });
      if (!userData) {
        throw new Error('user does not exists');
      }
      if (userData.role === 'admin') {
        resolve(parsedData);
      } else {
        throw new Error('The user who is requesting is not admin');
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const checkIfUserRequestingAdmin2 = (
  req: Request,
  jwtSecretKey: string,
  dataModel: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const parsedData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
      const { email } = parsedData;
      const userData = await dataModel.findOne({
        email,
      });
      if (!userData) {
        throw new Error('user does not exists');
      }
      if (userData.role === 'admin') {
        resolve(parsedData);
      } else {
        throw new Error('The user who is requesting is not admin');
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const checkIfUserRequestingAdmin3 = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authData = await getAndParseJwtTokenFromHeader(req, JWT_SECRET_KEY);
      const { userId } = authData;
      const userData = await userModel.findOne({
        id: userId,
      });
      if (!userData) {
        throw new Error('user does not exists');
      }
      if (userData.role === 'admin') {
        resolve('user is admin and is authorized');
      } else {
        throw new Error('The user who is requesting is not admin');
      }
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
