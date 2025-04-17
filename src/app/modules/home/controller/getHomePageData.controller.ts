import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { assetModel } from '../../asset/model/asset.model';
import { collaborationModelOfMantled } from '../../collaboration/model/collaboration.model';
import { getTotalNumberOfUniqueCollaborators } from '../../../../helpers/getTotalUniqueCollaborators';
import { givePercentageOfAsset2 } from '../../../../helpers/givePercentageOfAsset2';

export const getHomepageDataController = myControllerHandler(
  async (req, res) => {
    const tokenData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = tokenData;

    const userData = await userModelOfMantled.findOne({ email });

    if (!userData) {
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'User does not exist',
        data: {},
      });
    }

    let dataForClient: any = {
      username: userData.fullName,
      profileImageUrl: userData.profileImageUrl,
    };

    if (userData.role === 'user') {
      const assetsData = await assetModel.find({ ownerId: userData.id });
      const arrayOfAssetId = assetsData.map(asset => asset.id);

      const totalCollaborationData = await collaborationModelOfMantled.find({
        assetId: { $in: arrayOfAssetId },
      });

      dataForClient.totalNumberOfAssets = assetsData.length;
      dataForClient.totalNumberOfCollaborators =
        getTotalNumberOfUniqueCollaborators(totalCollaborationData);
      dataForClient.assetPercentage = givePercentageOfAsset2(assetsData);
    } else if (userData.role === 'collaborator') {
      const collaborationData = await collaborationModelOfMantled.find({
        collaboratorId: userData.id,
      });

      const arrayOfAssignedAssetId = collaborationData.map(
        collab => collab.assetId
      );

      const assignedAssetData = await assetModel.find({
        id: { $in: arrayOfAssignedAssetId },
      });

      // Get unique asset owners (clients)
      const uniqueClientIds = new Set(
        assignedAssetData.map(asset => asset.ownerId)
      );

      dataForClient.totalNumberOfAssignedAssets = assignedAssetData.length;
      dataForClient.percentageOfAssignedAssets =
        givePercentageOfAsset2(assignedAssetData);
      dataForClient.totalNumberOfClients = uniqueClientIds.size; // Add total number of unique clients
    }

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Data fetched successfully',
      data: dataForClient,
    });
  }
);
