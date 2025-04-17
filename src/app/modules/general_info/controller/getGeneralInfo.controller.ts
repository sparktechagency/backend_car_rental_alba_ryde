import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { generalInfoModelOfMantled } from '../model/generalInfo.model';

export const getGeneralInfoController = myControllerHandler(
  async (req, res) => {
    const { name } = req.params;
    let generalInfo = await generalInfoModelOfMantled.findOne();
    if (!generalInfo) {
      generalInfo = await generalInfoModelOfMantled.create({
        privacyPolicy: 'Test Privacy Policy',
        termsAndConditions: 'Terms and Conditions',
        aboutUs: 'Test About us',
        faqs: [
          {
            question: 'Who is the wife of Nerob?',
            answer: "Angelina Jolie is Nerob's Wife",
          },
          {
            question: 'Who is the first son of Nerob?',
            answer: 'Chris Gayle',
          },
        ],
      });
    }
    const { privacyPolicy, termsAndConditions, faqs, aboutUs } = generalInfo;
    let dataForClient: any = {};
    if (!name) {
      dataForClient.privacyPolicy = privacyPolicy;
      dataForClient.termsAndConditions = termsAndConditions;
      dataForClient.faqs = faqs;
      dataForClient.aboutUs = aboutUs;
    } else if (name === 'privacy-policy') {
      dataForClient.privacyPolicy = generalInfo.privacyPolicy;
    } else if (name === 'terms-and-conditions') {
      dataForClient.termsAndConditions = generalInfo.termsAndConditions;
    } else if (name === 'about-us') {
      dataForClient.aboutUs = generalInfo.aboutUs;
    } else if (name === 'faqs' || name === 'faq') {
      dataForClient.faqs = generalInfo.faqs;
    }

    const myResponse = {
      message: 'Data Fetched Successfully',
      success: true,
      ...dataForClient,
    };

    res.status(StatusCodes.OK).json(myResponse);
  }
);
