import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getRequestAndGiveDataOfClients } from '../../../../helpers/getRequestAndGiveDataOfClients';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const getListOfAllTheClientsOfACollaboratorController =
  myControllerHandler(async (req, res) => {
    // await checkIsBanned2(req);
    const clientsData = await getRequestAndGiveDataOfClients(req);
    const myResponse = {
      message: 'Data Of Clients Fetched Successful',
      success: true,
      clientsData: clientsData,
    };
    res.status(StatusCodes.OK).json(myResponse);
  });
