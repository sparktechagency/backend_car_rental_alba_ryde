import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { otpModel } from '../model/otp.model';

export const checkIfOtpIsCorrectController = myControllerHandler(
  async (req, res) => {
    const { otp } = req.body;
    const otpData = await otpModel.findOne({
      otp: otp,
    });
    if (!otpData) {
      throw new Error('this otp is not valid');
    }
    const myResponse = {
      message: 'this otp is valid',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
