import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getRequestAndGiveDataOfAssignedAssets } from '../../../../helpers_v2/request/getRequestAndGiveDataOfAssignedAssets.helper';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const getListOfAllTheAssetsAssignedToCollaboratorController =
  myControllerHandler(async (req, res) => {
    // await checkIsBanned2(req);
    const refinedAssetsData = await getRequestAndGiveDataOfAssignedAssets(req);

    const myResponse = {
      message: 'Asset Data Fetched Successfully',
      success: true,
      assignedAssets: refinedAssetsData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  });
