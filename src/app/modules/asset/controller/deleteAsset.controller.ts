import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { assetModel } from '../model/asset.model';

export const deleteAssetController = myControllerHandler(async (req, res) => {
  await checkIsBanned2(req);
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { asset_id } = req.body;
  const { email } = authData;
  const userData = await userModelOfMantled.findOne({ email });
  if (!userData) {
    throw new Error('user does not exist');
  }
  const assetData = await assetModel.findOne({ id: asset_id });
  if (!assetData) {
    throw new Error('asset does not exist');
  }
  if (assetData.ownerId !== userData.id) {
    throw new Error('user is not authorized to delete this');
  }
  await assetData.deleteOne();

  const myResponse = {
    message: 'Asset Deleted Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
