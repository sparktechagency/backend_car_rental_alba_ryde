import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { privacyTermsModel } from '../model/privacyTerms.model';

export const getPrivacyTermsController = myControllerHandler(
  async (req, res) => {
    const privacyTerms = await privacyTermsModel.findOne({});
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: privacyTerms,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
