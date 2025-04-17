import { assetModel } from '../app/modules/asset/model/asset.model';
import { userModelOfMantled } from '../app/modules/auth_v2/model/userModelOfMantled.model';
import { collaborationModelOfMantled } from '../app/modules/collaboration/model/collaboration.model';
import { jwtSecretKeyOfVault } from '../data/environmentVariables';
import { checkIsBanned } from '../helpers_v2/auth/checkIsBanned.helper';
import { formatDateAR7 } from './formatTimeAR7';
import { getAndParseTokenFromHeader2 } from './getAndParseBearerTokenFromHeader';
import { getOldestTime } from './giveOldestTime';

export const getRequestAndGiveDataOfClients = (req: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const vaultTokenData = await getAndParseTokenFromHeader2(
        req,
        jwtSecretKeyOfVault,
        'vaulttoken'
      );
      const { email } = vaultTokenData;
      const userData = await userModelOfMantled.findOne({ email });
      if (!userData) {
        throw new Error('user does not exists');
      }
      await checkIsBanned(userData);
      // data of collaboration
      const collaborationDataOfUser = await collaborationModelOfMantled.find({
        collaboratorId: userData.id,
      });
      const arrayOfAssetId = [];
      for (let i = 0; i < collaborationDataOfUser.length; i++) {
        arrayOfAssetId.push(collaborationDataOfUser[i].assetId);
      }
      // data of assets assigned to collaborator
      const dataOfAssets = await assetModel.find({
        id: { $in: arrayOfAssetId },
      });
      const arrayOfOwnerIdOfAssets = [];
      for (let i = 0; i < dataOfAssets.length; i++) {
        arrayOfOwnerIdOfAssets.push(dataOfAssets[i].ownerId);
      }
      const dataOfClients = await userModelOfMantled.find({
        id: { $in: arrayOfOwnerIdOfAssets },
      });

      const refinedDataOfClients: any = [];

      for (let i = 0; i < dataOfClients.length; i++) {
        const { id, profileImageUrl, fullName } = dataOfClients[i];
        const singleData = { id, profileImageUrl, fullName };
        refinedDataOfClients.push(singleData);
      }

      for (let i = 0; i < refinedDataOfClients.length; i++) {
        const singleClientData = refinedDataOfClients[i];
        const arrayOfAssetIdCollaborated = [];
        for (let i = 0; i < dataOfAssets.length; i++) {
          const singleAssetData = dataOfAssets[i];
          if (singleClientData.id === singleAssetData.ownerId) {
            arrayOfAssetIdCollaborated.push(singleAssetData.id);
          }
        }
        singleClientData.arrayOfAssetIdCollaborated =
          arrayOfAssetIdCollaborated;
      }

      for (let i = 0; i < refinedDataOfClients.length; i++) {
        const singleClientData = refinedDataOfClients[i];
        const arrayOfIdOfAssetsAssigned =
          singleClientData.arrayOfAssetIdCollaborated;
        const assignedTimeArray = [];
        for (let i = 0; i < arrayOfIdOfAssetsAssigned.length; i++) {
          const singleAssetId = arrayOfAssetId[i];
          for (let i = 0; i < collaborationDataOfUser.length; i++) {
            const singleCollaborationData = collaborationDataOfUser[i];
            if (singleCollaborationData.assetId === singleAssetId) {
              assignedTimeArray.push(singleCollaborationData.createdAt);
            }
          }
        }
        singleClientData.arrayOfAssignedTime = assignedTimeArray;
      }

      for (let i = 0; i < refinedDataOfClients.length; i++) {
        const addedOnTime = getOldestTime(
          refinedDataOfClients[i].arrayOfAssignedTime
        ) as string;
        refinedDataOfClients[i].addedOn = formatDateAR7(addedOnTime);
      }

      const dataForClient = [];
      for (let i = 0; i < refinedDataOfClients.length; i++) {
        const { id, profileImageUrl, fullName, addedOn } =
          refinedDataOfClients[i];
        const singleData = { clientId: id, profileImageUrl, fullName, addedOn };
        dataForClient.push(singleData);
      }

      resolve(dataForClient);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
