import { JWT_SECRET_KEY } from '../data/environmentVariables';
import { parseJwtToken } from './jwtAR7';
import { refineToken } from './refineToken';

type fType = (
  req: any,
  jwtSecretKey: any
) => Promise<{ iat: number; exp: number; [key: string]: any }>;
type fType2 = (
  req: any,
  jwtSecretKey: any,
  keyName: string
) => Promise<{ iat: number; exp: number; [key: string]: any }>;

export const getAndParseJwtTokenFromHeader: fType = (
  req: any,
  jwtSecretKey: string
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers.authorization;
      const authToken = refineToken(authHeader) as string;
      const userData = (await parseJwtToken(authToken, jwtSecretKey)) as any;
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

export const getAndParseTokenFromHeader2: fType2 = (
  req,
  jwtSecretKey,
  keyName
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers[keyName];
      const authToken = refineToken(authHeader) as string;
      console.log(authToken);
      const userData = (await parseJwtToken(authToken, jwtSecretKey)) as any;
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const getAndParseTokenFromHeader3: fType2 = (
  req,
  jwtSecretKey,
  keyName
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers[keyName];
      const authToken = refineToken(authHeader) as string;
      console.log(authToken);
      const userData = (await parseJwtToken(authToken, jwtSecretKey)) as any;
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const getAndParseTokenFromHeader4: fType2 = req => {
  return new Promise(async (resolve, reject) => {
    try {
      const authHeader = req.headers.authorization;
      const authToken = refineToken(authHeader) as string;
      console.log(authToken);
      const userData = (await parseJwtToken(authToken, JWT_SECRET_KEY)) as any;
      resolve(userData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
