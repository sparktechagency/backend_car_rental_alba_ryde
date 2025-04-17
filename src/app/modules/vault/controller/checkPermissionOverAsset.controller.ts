import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseTokenFromHeader2 } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKeyOfVault } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { collaborationModelOfMantled } from '../../collaboration/model/collaboration.model';

export const checkPermissionOverAssetController = myControllerHandler(
  async (req, res) => {
    const { assetId } = req.body;
    const authData = await getAndParseTokenFromHeader2(
      req,
      jwtSecretKeyOfVault,
      'vaulttoken'
    );
    const { email } = authData;
    const userData = await userModelOfMantled.findOne({ email });
    if (!userData) {
      throw new Error('user does not exists');
    }
    const collaborationData = await collaborationModelOfMantled.findOne({
      collaboratorId: userData.id,
      assetId: assetId,
    });
    if (!collaborationData) {
      throw new Error(
        'user does not have permission to read or download anything of this asset'
      );
    }

    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
      permission: collaborationData.permission,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
