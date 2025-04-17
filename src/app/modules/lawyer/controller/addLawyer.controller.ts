import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { lawyerModelOfMantled } from '../model/lawyer.model';
import { checkIfUserRequestingAdmin } from '../../../../helpers/checkIfRequestedUserAdmin';
import { jwtSecretKey } from '../../../../data/environmentVariables';

export const addLawyerController = myControllerHandler(async (req, res) => {
  await checkIfUserRequestingAdmin(req, jwtSecretKey);
  const myData = await getDataFromFormOfRequest(req);
  const {
    lawyer_name,
    lawyer_experience_in_year,
    lawyer_phone_number,
    lawyer_email,
  } = myData.fields;
  const lawyerImage = myData.files.lawyer_image;
  let imageUrlOfLawyer: any;
  if (lawyerImage) {
    imageUrlOfLawyer = await saveAndGiveRefinedUrl(
      lawyerImage[0],
      './public/images/lawyer'
    );
  }
  console.log({
    lawyer_name,
    lawyer_experience_in_year,
    lawyer_phone_number,
    lawyer_email,
  });

  await lawyerModelOfMantled.create({
    name: lawyer_name[0],
    yearsOfExperience: Number(lawyer_experience_in_year[0]),
    phone: lawyer_phone_number[0],
    email: lawyer_email[0],
    imageUrl: imageUrlOfLawyer,
  });
  const myResponse = {
    message: 'lawyer added successfully',
    success: true,
    data: {},
  };
  res.status(StatusCodes.OK).json(myResponse);
});
