import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { lawyerModelOfMantled } from '../model/lawyer.model';

export const getLawyerDataController = myControllerHandler(async (req, res) => {
  const lawyerData = await lawyerModelOfMantled.find({});
  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: lawyerData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
