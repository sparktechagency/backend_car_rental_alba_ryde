import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseTokenFromHeader2 } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKeyOfVault } from '../../../../data/environmentVariables';
import { assetModel } from '../../asset/model/asset.model';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { collaborationModelOfMantled } from '../../collaboration/model/collaboration.model';
import { removeDuplicates } from '../../../../helpers/removeDuplicatesFromStringOfArray';
import {
  checkIsBanned,
  checkIsBanned2,
} from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const getDetailsOfSingleAssetController = myControllerHandler(
  async (req, res) => {
    // await checkIsBanned2(req);
    const vaultTokenData = await getAndParseTokenFromHeader2(
      req,
      jwtSecretKeyOfVault,
      'vaulttoken'
    );
    const { assetId } = req.query;
    const { email } = vaultTokenData;
    const userData = await userModelOfMantled.findOne({ email });
    const assetData = await assetModel.findOne({ id: assetId });
    if (!userData) {
      throw new Error('user does not exists');
    }
    await checkIsBanned(userData);
    if (!assetData) {
      throw new Error('Asset does not exists');
    }

    const collaborationData = await collaborationModelOfMantled.find({
      assetId: assetData.id,
    });
    // get data of collaborators added to this asset
    let arrayOfCollaboratorId = [];
    for (let i = 0; i < collaborationData.length; i++) {
      arrayOfCollaboratorId.push(collaborationData[i].collaboratorId);
    }

    // check if the user requesting is the owner/collaborator of the asset or not
    if (
      userData.id !== assetData.ownerId &&
      !arrayOfCollaboratorId.includes(userData.id)
    ) {
      throw new Error(
        'User does not have permission to view details of this asset'
      );
    }

    // get data of collaboration of this asset

    arrayOfCollaboratorId = removeDuplicates(arrayOfCollaboratorId);
    const dataOfCollaborators = await userModelOfMantled.find({
      id: { $in: arrayOfCollaboratorId },
    });
    // refine the collaborators data
    const refinedDataOfCollaborator = [];
    for (let i = 0; i < dataOfCollaborators.length; i++) {
      const singleData = dataOfCollaborators[i];
      const { id, email, fullName, phoneNumber, profileImageUrl } = singleData;
      const refinedSingleData = {
        id,
        email,
        fullName,
        phoneNumber,
        profileImageUrl,
      };
      refinedDataOfCollaborator.push(refinedSingleData);
    }

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Asset Data Fetched Successfully',
      data: {
        assetData,
        collaboratorsAssignedToThisAsset: refinedDataOfCollaborator,
      },
    });
  }
);
