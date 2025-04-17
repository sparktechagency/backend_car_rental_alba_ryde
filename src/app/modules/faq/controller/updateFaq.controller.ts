import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { faqModel } from '../model/faq.model';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';

export const updateFaqController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin3(req);
  const { id, question, answer } = req.body;

  if (!id) {
    throw new Error('please enter id');
  }
  if (!question && !answer) {
    throw new Error('please enter either updated question or updated answer');
  }

  const faqData = await faqModel.findOne({ id });
  if (!faqData) {
    throw new Error('faq does not exist with this id');
  }

  if (question) {
    faqData.question = question;
  }
  if (answer) {
    faqData.answer = answer;
  }

  await faqData.save();

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: faqData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
