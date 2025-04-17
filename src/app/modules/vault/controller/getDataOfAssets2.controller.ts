import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseTokenFromHeader2 } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKeyOfVault } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { assetModel } from '../../asset/model/asset.model';
import {
  checkIsBanned,
  checkIsBanned2,
} from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const getDataOfAssetController2 = myControllerHandler(
  async (req, res) => {
    // await checkIsBanned2(req);
    console.log('Incoming request to getDataOfAssetController');

    const vaultToken = req.headers['vaulttoken'];
    if (!vaultToken) {
      console.error('Missing vaulttoken in request headers');
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Authentication token is missing',
        data: {},
      });
    }

    let vaultTokenData;
    try {
      vaultTokenData = await getAndParseTokenFromHeader2(
        req,
        jwtSecretKeyOfVault,
        'vaulttoken'
      );
    } catch (error: any) {
      console.error('Error parsing vaulttoken:', error.message);
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Invalid or expired token',
        data: {},
      });
    }

    const { email } = vaultTokenData;
    if (!email) {
      console.error('Token does not contain a valid email');
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Invalid token data',
        data: {},
      });
    }

    console.log(`Authenticated user: ${email}`);

    const userData = await userModelOfMantled.findOne({ email }).lean();
    if (!userData) {
      console.error(`User not found for email: ${email}`);
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'User does not exist',
        data: {},
      });
    }

    await checkIsBanned(userData);

    let { assetType } = req.body;
    assetType = assetType.toLowerCase();
    console.log(' asset type is ', assetType);
    console.log(
      `Fetching assets for user: ${userData.id}, assetType: ${
        assetType || 'All'
      }`
    );

    const filter: any = { ownerId: userData.id };
    if (assetType) {
      filter.type = assetType;
    }

    const assetsData = await assetModel.find(filter).lean();
    console.log(`Found ${assetsData.length} assets`);

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Asset Data Fetched Successfully',
      data: {
        assetsData: assetsData || [],
      },
    });
  }
);
