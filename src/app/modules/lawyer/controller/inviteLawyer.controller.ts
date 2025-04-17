import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { lawyerModelOfMantled } from '../model/lawyer.model';
import { getUserDataFromRequest } from '../../../../helpers/getUserDataFromRequest.helper';
import { sendLawyerInviteEmail } from '../../../../helpers/sendLawyerInviteEmail';

export const inviteLawyerController = myControllerHandler(async (req, res) => {
  const userData = (await getUserDataFromRequest(req)) as any;

  const { lawyerId } = req.body;

  const lawyerData = await lawyerModelOfMantled.findOne({ id: lawyerId });
  if (!lawyerData) {
    throw new Error('lawyer does not exist');
  }

  await sendLawyerInviteEmail(
    userData.fullName,
    lawyerData.name,
    lawyerData.email
  );

  const myResponse = {
    message: 'Invite Sent Successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
