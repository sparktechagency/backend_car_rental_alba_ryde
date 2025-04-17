import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { faqModel } from '../model/faq.model';

export const getFaqController = myControllerHandler(async (req, res) => {
  const myData = await faqModel.find();
  const myResponse = {
    message: 'Faq data fetched successfully',
    success: true,
    data: myData,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
