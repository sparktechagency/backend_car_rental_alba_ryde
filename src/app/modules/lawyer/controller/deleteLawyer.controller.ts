import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { lawyerModelOfMantled } from '../model/lawyer.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';

export const deleteLawyerController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin(req, jwtSecretKey);
  const { lawyerId } = req.body;
  const lawyerData = await lawyerModelOfMantled.findOne({ id: lawyerId });
  if (!lawyerData) {
    throw new Error('lawyer does not exist');
  }
  await lawyerData.deleteOne();
  const myResponse = {
    message: 'Lawyer Deleted Successful Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
