import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { faqModel } from '../model/faq.model';

export const getSingleFaqController = myControllerHandler(async (req, res) => {
  const { id } = req.params;
  const myFaq = await faqModel.findOne({ id });
  if (!myFaq) {
    throw new Error('faq does not exist');
  }
  const myResponse = {
    message: 'Review Given Successfully',
    success: true,
    data: myFaq,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
