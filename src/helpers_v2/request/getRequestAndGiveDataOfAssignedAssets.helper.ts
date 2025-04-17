import { assetModel } from '../../app/modules/asset/model/asset.model';
import { userModelOfMantled } from '../../app/modules/auth_v2/model/userModelOfMantled.model';
import { collaborationModelOfMantled } from '../../app/modules/collaboration/model/collaboration.model';
import { jwtSecretKeyOfVault } from '../../data/environmentVariables';
import { formatDateAR7 } from '../../helpers/formatTimeAR7';
import { getAndParseTokenFromHeader2 } from '../../helpers/getAndParseBearerTokenFromHeader';
import { checkIsBanned } from '../auth/checkIsBanned.helper';

export const getRequestAndGiveDataOfAssignedAssets = (req: any) => {
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
        throw new Error('User does not exists');
      }
      await checkIsBanned(userData);

      const collaborationData = await collaborationModelOfMantled.find({
        collaboratorId: userData.id,
      });

      const arrayOfAssetId = [];

      for (let i = 0; i < collaborationData.length; i++) {
        arrayOfAssetId.push(collaborationData[i].assetId);
      }

      const assetsData = await assetModel.find({ id: { $in: arrayOfAssetId } });

      const refinedAssetsData: any = [];

      for (let i = 0; i < assetsData.length; i++) {
        const { assetName, id, assetDocumentUrl } = assetsData[i];
        refinedAssetsData.push({
          assetName,
          assetId: id,
          assetImage: assetDocumentUrl,
        });
      }

      for (let i = 0; i < refinedAssetsData.length; i++) {
        const singleAssetData = refinedAssetsData[i];
        for (let i = 0; i < collaborationData.length; i++) {
          const singleCollaborationData: any = collaborationData[i];
          if (singleAssetData.assetId === singleCollaborationData.assetId) {
            singleAssetData.addedOn = formatDateAR7(
              singleCollaborationData.createdAt
            );
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
