import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { invitationModelOfMantled } from '../model/invitation.controller';
import { collaborationModelOfMantled } from '../../collaboration/model/collaboration.model';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';

export const acceptOrRejectInvitationController = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { email } = authData;
    const { inviteId, action } = req.body;

    // Validate request body
    if (!inviteId || !action) {
      return sendResponse(res, {
        code: StatusCodes.BAD_REQUEST,
        message: 'inviteId and action are required.',
      });
    }

    if (!['accept', 'reject'].includes(action)) {
      return sendResponse(res, {
        code: StatusCodes.BAD_REQUEST,
        message: "Invalid action. Allowed values are 'accept' or 'reject'.",
      });
    }

    // Find user and invitation
    const userData = await userModelOfMantled.findOne({ email });
    if (!userData) {
      return sendResponse(res, {
        code: StatusCodes.UNAUTHORIZED,
        message: 'User with this token does not exist.',
      });
    }

    const inviteData = await invitationModelOfMantled.findOne({ id: inviteId });
    if (!inviteData) {
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'Invalid invitation ID.',
      });
    }

    if (inviteData.status !== 'pending') {
      return sendResponse(res, {
        code: StatusCodes.CONFLICT,
        message: 'Action for this invitation has already been taken.',
      });
    }

    if (userData.id !== inviteData.inviteeId) {
      return sendResponse(res, {
        code: StatusCodes.FORBIDDEN,
        message: 'You are not authorized to take action on this invite.',
      });
    }

    // Process action
    if (action === 'accept') {
      await collaborationModelOfMantled.create({
        assetId: inviteData.assetId,
        collaboratorId: inviteData.inviteeId,
        permission: inviteData.permission,
      });

      await invitationModelOfMantled.findOneAndUpdate(
        { id: inviteId },
        { status: 'accepted' }
      );
    } else {
      await invitationModelOfMantled.findOneAndUpdate(
        { id: inviteId },
        { status: 'rejected' }
      );
    }

    // Send success response
    sendResponse(res, {
      code: StatusCodes.OK,
      message: `Invitation ${action}ed successfully.`,
      data: { inviteId, status: action },
    });
  }
);
