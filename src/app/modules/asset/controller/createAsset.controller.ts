import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { assetModel } from '../model/asset.model';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { sendCollaboratorInvitationEmail } from '../../../../helpers/sendEmailToJoinAsCollaborator';
import { sendEmailToSignUpAndJoinAsCollaborator } from '../../../../helpers/sendEmailToCreateANewAccountAndJoinAsCollaborator';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { invitationModelOfMantled } from '../../invitation/model/invitation.controller';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const createAssetController = myControllerHandler(async (req, res) => {
  await checkIsBanned2(req);
  const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
  const { email } = authData;
  const userData = await userModelOfMantled.findOne({ email });

  if (!userData) {
    throw new Error('User does not exist');
  }

  const myData = await getDataFromFormOfRequest(req);
  console.log(myData);
  const { fields, files } = myData;

  const ownerId = userData.id;
  const assetName = fields.assetName ? fields.assetName[0] : null;
  if (!assetName) {
    throw new Error('Asset name is required');
  }

  const assetType = fields.assetType ? fields.assetType[0].toLowerCase() : '';
  const collaboratorEmail = fields.collaboratorEmail
    ? fields.collaboratorEmail[0]
    : '';
  const assetDetails = fields.assetDetails ? fields.assetDetails[0] : '';
  const beneficiaryName = fields.beneficiaryName
    ? fields.beneficiaryName[0]
    : '';
  const beneficiaryDateOfBirth = fields.beneficiaryDateOfBirth
    ? fields.beneficiaryDateOfBirth[0]
    : '';
  const relationWithBeneficiary = fields.relationWithBeneficiary
    ? fields.relationWithBeneficiary[0]
    : '';

  let assetDocumentUrl = '';
  let beneficiaryDocumentUrl = '';

  if (files.assetDocument && files.assetDocument[0]) {
    assetDocumentUrl = await saveAndGiveRefinedUrl(
      files.assetDocument[0],
      './public/images/documents/'
    );
  }
  if (files.beneficiaryDocument && files.beneficiaryDocument[0]) {
    beneficiaryDocumentUrl = await saveAndGiveRefinedUrl(
      files.beneficiaryDocument[0],
      './public/images/documents/'
    );
  }

  let assetDateAfterSaved;

  if (assetType === 'real estate') {
    assetDateAfterSaved = await assetModel.create({
      ownerId,
      assetName,
      type: assetType,
      assetDetails,
      assetCountry: fields.assetCountry ? fields.assetCountry[0] : '',
      assetState: fields.assetState ? fields.assetState[0] : '',
      assetAddress: fields.assetAddress ? fields.assetAddress[0] : '',
      beneficiaryName,
      beneficiaryDateOfBirth,
      relationWithBeneficiary,
      assetDocumentUrl,
      beneficiaryDocumentUrl,
    });
  } else {
    assetDateAfterSaved = await assetModel.create({
      ownerId,
      assetName,
      type: assetType,
      assetDetails,
      accountNumber: fields.accountNumber ? fields.accountNumber[0] : '',
      accountName: fields.accountName ? fields.accountName[0] : '',
      beneficiaryName,
      beneficiaryDateOfBirth,
      relationWithBeneficiary,
      assetDocumentUrl,
      beneficiaryDocumentUrl,
    });
  }

  if (collaboratorEmail && /\S+@\S+\.\S+/.test(collaboratorEmail)) {
    const collaboratorData = await userModelOfMantled.findOne({
      email: collaboratorEmail,
    });
    if (collaboratorData) {
      if (collaboratorData.role === 'collaborator') {
        await invitationModelOfMantled.create({
          inviterId: userData.id,
          inviteeId: collaboratorData.id,
          assetId: assetDateAfterSaved?.id,
        });
      } else {
        throw new Error(
          `The invited person is a ${collaboratorData.role}, not a collaborator`
        );
      }
    } else {
      await sendEmailToSignUpAndJoinAsCollaborator(
        collaboratorEmail,
        assetName
      );
    }
  } else {
    console.error('Invalid or missing collaborator email');
  }

  sendResponse(res, {
    code: StatusCodes.OK,
    message: 'Asset Created Successfully',
    data: {},
  });
});
