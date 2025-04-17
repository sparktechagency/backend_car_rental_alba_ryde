import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { userModelOfMantled } from '../../auth_v2/model/userModelOfMantled.model';

export const approveOrRejectAuthCardController = myControllerHandler(
  async (req, res) => {
    const { userId, action } = req.body;
    const userData = await userModelOfMantled.findOne({ id: userId });
    if (!userData) {
      throw new Error('user does not exists');
    }
    if (!action) {
      throw new Error('please enter a action');
    }
    let status: any;
    if (action === 'approve') {
      userData.authCardImageApprovalStatus = 'approved';
      status = 'Approved';
    } else if (action === 'reject') {
      userData.authCardImageApprovalStatus = 'rejected';
      status = 'Rejected';
    }
    await userData.save();
    const myResponse = {
      message: `Authcard ${status} Successfully`,
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
