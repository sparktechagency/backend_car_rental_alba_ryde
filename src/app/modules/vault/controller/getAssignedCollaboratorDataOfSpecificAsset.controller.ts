import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseTokenFromHeader2 } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKeyOfVault } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { assetModel } from '../../asset/model/asset.model';
import { collaborationModelOfMantled } from '../../collaboration/model/collaboration.model';
import { removeDuplicates } from '../../../../helpers/removeDuplicatesFromStringOfArray';
import {
  checkIsBanned,
  checkIsBanned2,
} from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const getAssignedCollaboratorDataOfSpecificAssetController =
  myControllerHandler(async (req, res) => {
    // await checkIsBanned2(req);
    const { asset_type } = req.body;
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

    if (!vaultTokenData?.email) {
      console.error('Token does not contain a valid email');
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Invalid token data',
        data: {},
      });
    }

    console.log(`Authenticated user: ${vaultTokenData.email}`);

    const userData = await userModelOfMantled.findOne({
      email: vaultTokenData.email,
    });
    if (!userData) {
      console.error(`User not found for email: ${vaultTokenData.email}`);
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'User does not exist',
        data: {},
      });
    }

    await checkIsBanned(userData);

    console.log(`Fetching assets for user: ${userData.id}`);
    const assetsOfUser = await assetModel.find({
      ownerId: userData.id,
      type: { $regex: new RegExp(`^${asset_type}$`, 'i') }, // Case-insensitive regex match
    });

    if (assetsOfUser.length === 0) {
      console.log('User has no assets.');
      return sendResponse(res, {
        code: StatusCodes.OK,
        message: 'User has no assigned collaborators',
        data: {
          dataOfCollaborators: [],
        },
      });
    }

    const arrayOfAssetId = assetsOfUser.map(asset => asset.id);

    console.log(
      `Found ${arrayOfAssetId.length} assets. Fetching collaborations...`
    );
    const collaborationDataOfUser = await collaborationModelOfMantled.find({
      assetId: { $in: arrayOfAssetId },
    });

    if (collaborationDataOfUser.length === 0) {
      console.log('No collaborations found for user assets.');
      return sendResponse(res, {
        code: StatusCodes.OK,
        message: 'User has no assigned collaborators',
        data: {
          dataOfCollaborators: [],
        },
      });
    }

    let arrayOfCollaboratorId = collaborationDataOfUser.map(
      collab => collab.collaboratorId
    );
    arrayOfCollaboratorId = removeDuplicates(arrayOfCollaboratorId);

    console.log(
      `Fetching details of ${arrayOfCollaboratorId.length} unique collaborators.`
    );
    const dataOfCollaborators = await userModelOfMantled.find({
      id: { $in: arrayOfCollaboratorId },
    });

    const refinedDataOfCollaborator = dataOfCollaborators.map(
      ({ id, email, fullName, phoneNumber, profileImageUrl }) => ({
        id,
        email,
        fullName,
        phoneNumber,
        profileImageUrl,
      })
    );

    console.log(
      `Returning ${refinedDataOfCollaborator.length} collaborator records.`
    );
    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Collaborator Data Fetched Successfully',
      data: {
        dataOfCollaborators: refinedDataOfCollaborator,
      },
    });
  });
