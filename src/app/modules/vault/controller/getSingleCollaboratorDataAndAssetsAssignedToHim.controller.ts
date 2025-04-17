import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseTokenFromHeader2 } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKeyOfVault } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { assetModel } from '../../asset/model/asset.model';
import { collaborationModelOfMantled } from '../../collaboration/model/collaboration.model';
import {
  checkIsBanned,
  checkIsBanned2,
} from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const getSingleCollaboratorDataAndAssetsAssignedToHimController =
  myControllerHandler(async (req, res) => {
    // await checkIsBanned2(req);
    const vaultTokenData = await getAndParseTokenFromHeader2(
      req,
      jwtSecretKeyOfVault,
      'vaulttoken'
    );
    const { email } = vaultTokenData;
    const { collaboratorId } = req.query;
    const userData = await userModelOfMantled.findOne({ email });
    console.log(collaboratorId);
    const collaboratorData = await userModelOfMantled.findOne({
      id: collaboratorId,
    });
    if (!userData) {
      throw new Error('User does not exist with this token');
    }

    await checkIsBanned(userData);
    if (!collaboratorData) {
      throw new Error('Collaborator does not exist with this id');
    }
    // find all asset of the user
    const assetsData = await assetModel.find({ ownerId: userData.id });
    const arrayOfAssetId: any = [];
    for (let i = 0; i < assetsData.length; i++) {
      arrayOfAssetId.push(assetsData[i].id);
    }
    // find collaboration data of the user's asset
    const collaborationData = await collaborationModelOfMantled.find({
      collaboratorId,
      assetId: { $in: arrayOfAssetId },
    });
    const arrayOfAssetsIdAssignedToThisCollaborator: any = [];
    for (let i = 0; i < collaborationData.length; i++) {
      arrayOfAssetsIdAssignedToThisCollaborator.push(
        collaborationData[i].assetId
      );
    }
    // find assets assigned to this collaborator
    const assetsAssignedToThisCollaborator = await assetModel.find({
      id: { $in: arrayOfAssetsIdAssignedToThisCollaborator },
    });

    const dataForclient: any = {};
    const makeDataForClient = () => {
      const { email, id, fullName, phoneNumber, profileImageUrl } =
        collaboratorData;
      const dataOfCollaborator = {
        email,
        id,
        fullName,
        phoneNumber,
        profileImageUrl,
      };
      dataForclient.dataOfCollaborator = dataOfCollaborator;
      dataForclient.assetsAssignedToThisCollaborator =
        assetsAssignedToThisCollaborator;
    };
    makeDataForClient();

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Data Fetched Successfully',
      data: dataForclient,
    });
  });
