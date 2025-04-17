import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { getAndParseJwtTokenFromHeader } from '../../../../helpers/getAndParseBearerTokenFromHeader';
import { jwtSecretKey } from '../../../../data/environmentVariables';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';
import { assetModel } from '../../asset/model/asset.model';
import { collaborationModelOfMantled } from '../model/collaboration.model';
import { invitationModelOfMantled } from '../../invitation/model/invitation.controller';
import { checkIsBanned2 } from '../../../../helpers_v2/auth/checkIsBanned.helper';
import { NotificationModel } from '../../notifications_v2/model/notification.model';

export const addCollaboratorController = myControllerHandler(
  async (req, res) => {
    await checkIsBanned2(req);
    const authData = await getAndParseJwtTokenFromHeader(req, jwtSecretKey);
    const { assetId, emailOfCollaborator, permission } = req.body;
    const { email } = authData;

    const userData = await userModelOfMantled.findOne({ email });
    if (!userData) {
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'User does not exist',
        data: {},
      });
    }

    const collaboratorData = await userModelOfMantled.findOne({
      email: emailOfCollaborator,
    });
    if (!collaboratorData) {
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'This collaborator does not have an account here',
        data: {},
      });
    }

    if (collaboratorData.role !== 'collaborator') {
      return sendResponse(res, {
        code: StatusCodes.BAD_REQUEST,
        message: 'This user is not a collaborator',
        data: {},
      });
    }

    const userId = userData.id;
    const assetData = await assetModel.findOne({ id: assetId });

    if (!assetData) {
      return sendResponse(res, {
        code: StatusCodes.NOT_FOUND,
        message: 'Asset does not exist',
        data: {},
      });
    }

    if (assetData.ownerId !== userId) {
      return sendResponse(res, {
        code: StatusCodes.FORBIDDEN,
        message: 'The user who requested is not the owner of this asset',
        data: {},
      });
    }

    await invitationModelOfMantled.create({
      assetId,
      inviterId: userId,
      inviteeId: collaboratorData.id,
      permission,
    });

    await NotificationModel.create({
      userId: collaboratorData.id,
      type: 'info',
      title: 'Collaboration Invite',
      message: `${userData.fullName} has invited you to be a collaborator of their asset`,
    });

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'Invite Sent Successfully',
      data: {},
    });
  }
);
