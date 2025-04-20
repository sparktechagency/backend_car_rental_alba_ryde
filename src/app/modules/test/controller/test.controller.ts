import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { simplySaveFileToFolder } from '../../../../helpers/simplySaveToFolder.helper';

export const testController = myControllerHandler(async (req, res) => {
  const myData = await getDataFromFormOfRequest(req);
  const exampleFile = myData.files['members[0][memberImage]'][0];

  await simplySaveFileToFolder(exampleFile, './public/test');

  const myResponse = {
    message: 'test Given Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
