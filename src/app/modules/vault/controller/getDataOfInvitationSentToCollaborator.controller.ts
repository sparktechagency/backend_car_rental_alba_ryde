import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseTokenFromHeader2 } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKeyOfVault } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { invitationModelOfMantled } from '../../invitation/model/invitation.controller';
import { removeDuplicates } from '../../../../helpers/removeDuplicatesFromStringOfArray';
import {
  checkIsBanned,
  checkIsBanned2,
} from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const getDataOfInvitationSentToCollaboratorController =
  myControllerHandler(async (req, res) => {
    // await checkIsBanned2(req);
    console.log(
      'Incoming request to getDataOfInvitationSentToCollaboratorController'
    );

    // Extract token and validate
    const vaultToken = req.headers['vaulttoken'];
    if (!vaultToken) {
      console.error('Missing vaulttoken in request headers');
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Authentication token is missing',
        data: {},
      });
    }

    let vaultTokenData;
    try {
      vaultTokenData = await getAndParseTokenFromHeader2(
        req,
        jwtSecretKeyOfVault,
        'vaulttoken'
      );
    } catch (error: any) {
      console.error('Error parsing vaulttoken:', error.message);
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Invalid or expired token',
        data: {},
      });
    }

    const { email } = vaultTokenData;
    if (!email) {
      console.error('Token does not contain a valid email');
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'Invalid token data',
        data: {},
      });
    }

    console.log(`Authenticated user: ${email}`);

    // Fetch user data
    const userData = await userModelOfMantled.findOne({ email }).lean();
    if (!userData) {
      console.error(`User not found for email: ${email}`);
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'User does not exist',
        data: {},
      });
    }

    await checkIsBanned(userData);

    console.log(`Fetching invitations sent by user: ${userData.id}`);
    const dataOfInvitations: any = await invitationModelOfMantled
      .find({ inviterId: userData.id })
      .lean();

    if (dataOfInvitations.length === 0) {
      console.log('No invitations found.');
      return sendResponse(res, {
        code: StatusCodes.OK,
        message: 'No invitations found',
        data: {
          dataOfInvitations: [],
        },
      });
    }

    const arrayOfInviteeId = removeDuplicates(
      dataOfInvitations.map((invite: any) => invite.inviteeId)
    );

    console.log(`Fetching details of ${arrayOfInviteeId.length} invitees.`);
    const inviteeData = await userModelOfMantled
      .find({ id: { $in: arrayOfInviteeId } })
      .lean();

    // Create an invitee lookup map using a for loop
    const inviteeMap: any = {};
    for (let i = 0; i < inviteeData.length; i++) {
      const invitee = inviteeData[i];
      inviteeMap[invitee.id] = {
        inviteeName: invitee.fullName,
        imageUrlOfInvitee: invitee.profileImageUrl,
      };
    }

    // Merge invitation data with invitee details using a for loop
    const refinedDataOfInvitation = [];
    for (let i = 0; i < dataOfInvitations.length; i++) {
      const invite = dataOfInvitations[i];
      refinedDataOfInvitation.push({
        date: invite.createdAt,
        inviteeId: invite.inviteeId,
        assetId: invite.assetId,
        invitationStatus: invite.status,
        inviteeName: inviteeMap[invite.inviteeId]?.inviteeName || 'Unknown',
        imageUrlOfInvitee:
          inviteeMap[invite.inviteeId]?.imageUrlOfInvitee || null,
      });
    }

    console.log(
      `Returning ${refinedDataOfInvitation.length} invitation records.`
    );

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Invitation Data Fetched Successfully',
      data: {
        dataOfInvitations: refinedDataOfInvitation,
      },
    });
  });
