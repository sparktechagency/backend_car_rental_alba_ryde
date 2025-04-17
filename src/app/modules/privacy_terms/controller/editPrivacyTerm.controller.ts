import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { privacyTermsModel } from '../model/privacyTerms.model';

export const editPrivacyTermsController = myControllerHandler(
  async (req, res) => {
    const { privacy_terms } = req.body;
    const privacyTerm = await privacyTermsModel.findOne({});
    if (!privacyTerm) {
      throw new Error('privacy term is not created yet');
    }
    privacyTerm.privacy_terms = privacy_terms;
    await privacyTerm.save();
    const myResponse = {
      message: 'Privacy Term updated successfully',
      success: true,
      data: {},
      privacyTerm,
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
