import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import {
  checkIfUserRequestingAdmin,
  checkIfUserRequestingAdmin3,
} from '../../../../helpers/checkIfRequestedUserAdmin';
import { faqModel } from '../model/faq.model';

export const createNewFaqController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin3(req);
  const { question, answer } = req.body;
  if (!question) {
    throw new Error('please enter a question');
  }
  if (!answer) {
    throw new Error('please enter a answer');
  }

  const createdData = await faqModel.create({
    question: question,
    answer: answer,
  });

  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: createdData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
