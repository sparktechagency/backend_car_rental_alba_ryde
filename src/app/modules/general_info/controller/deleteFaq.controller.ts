import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { generalInfoModelOfMantled } from '../model/generalInfo.model';

export const deleteFaqController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin(req, jwtSecretKey);
  const { question } = req.body;
  const oldData = await generalInfoModelOfMantled.findOne();

  if (!oldData) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message:
        'General Info Data not created yet. Please hit /api/v1/general-info/ first with get method.',
    });
  }
  const oldFaqs = oldData.faqs;

  const newFaqsData = oldFaqs.filter((data: any) => data.question !== question);
  oldData.faqs = newFaqsData;
  await oldData.save();

  const myResponse = {
    message: 'Faq deleted successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
