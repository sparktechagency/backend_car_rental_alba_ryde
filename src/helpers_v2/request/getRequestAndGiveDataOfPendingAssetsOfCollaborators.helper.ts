import { assetModel } from '../../app/modules/asset/model/asset.model';
import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { collaborationModelOfMantled } from '../../app/modules/collaboration/model/collaboration.model';
import { invitationModelOfMantled } from '../../app/modules/invitation/model/invitation.controller';
import { jwtSecretKeyOfVault } from '../../data/environmentVariables';
import { formatDateAR7 } from '../../helpers/formatTimeAR7';
import { getAndParseTokenFromHeader2 } from '../../helpers/getAndParseBearerTokenFromHeader';
import { checkIsBanned } from '../auth/checkIsBanned.helper';

export const getRequestAndGiveDataOfPendingAssetsOfCollaborators = (
  req: any
) => {
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
        throw new Error('User does not exist');
      }
      await checkIsBanned(userData);

      const invitationData = await invitationModelOfMantled.find({
        inviteeId: userData.id,
        status: 'pending',
      });

      const arrayOfAssetId = [];
      for (let i = 0; i < invitationData.length; i++) {
        arrayOfAssetId.push(invitationData[i].assetId);
      }

      const assetsData = await assetModel.find({ id: { $in: arrayOfAssetId } });

      const refinedAssetsData: any = [];

      for (let i = 0; i < assetsData.length; i++) {
        const { assetName, id, assetDocumentUrl, assetDetails, ownerId } =
          assetsData[i];
        refinedAssetsData.push({
          assetName,
          assetId: id,
          assetImage: assetDocumentUrl,
          assetDetails,
          ownerId,
          inviteId: null, // Placeholder for inviteId
          invitedOn: null, // Placeholder for invitedOn date
        });
      }

      for (let i = 0; i < refinedAssetsData.length; i++) {
        const singleAssetData = refinedAssetsData[i];
        for (let j = 0; j < invitationData.length; j++) {
          const singleCollaborationData: any = invitationData[j];
          if (singleAssetData.assetId === singleCollaborationData.assetId) {
            singleAssetData.inviteId = singleCollaborationData.id; // Adding inviteId
            singleAssetData.invitedOn = formatDateAR7(
              singleCollaborationData.createdAt
            );
          }
        }
      }

      const arrayOfOwnerId: any = [];
      for (let i = 0; i < assetsData.length; i++) {
        const singleData = assetsData[i];
        arrayOfOwnerId.push(singleData.ownerId);
      }

      const ownersData = await userModelOfMantled.find({
        id: { $in: arrayOfOwnerId },
      });

      for (let i = 0; i < refinedAssetsData.length; i++) {
        const singleAssetData = refinedAssetsData[i];
        const idOfAssetOwner = singleAssetData.ownerId;
        for (let i = 0; i < ownersData.length; i++) {
          const singleOwnerData = ownersData[i];
          if (idOfAssetOwner === singleOwnerData.id) {
            singleAssetData.ownerName = singleOwnerData.fullName;
          }
        }
      }

      resolve(refinedAssetsData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
