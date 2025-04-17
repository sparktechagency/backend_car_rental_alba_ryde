import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { checkIfUserRequestingAdmin2 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { generalInfoModelOfMantled } from '../../general_info/model/generalInfo.model';

export const updateGeneralInfoController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin2(req, jwtSecretKey, userModelOfMantled);
    const { name } = req.params;

    if (name === 'privacy-policy') {
      const { privacyPolicy } = req.body;
      await generalInfoModelOfMantled.findOneAndUpdate({}, { privacyPolicy });
    } else if (name === 'terms-and-conditions') {
      const { termsAndConditions } = req.body;
      await generalInfoModelOfMantled.findOneAndUpdate(
        {},
        { termsAndConditions }
      );
    } else if (name === 'about-us') {
      const { aboutUs } = req.body;
      await generalInfoModelOfMantled.findOneAndUpdate({}, { aboutUs });
    } else if (name === 'faq') {
      const { faqs } = req.body;
      await generalInfoModelOfMantled.findOneAndUpdate({}, { faqs });
    }

    const myResponse = {
      message: 'Updating Successful',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
