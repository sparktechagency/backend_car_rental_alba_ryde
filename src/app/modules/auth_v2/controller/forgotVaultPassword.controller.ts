import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { hashMyPassword } from '../../../../helpers/passwordHashing';
import { getUserDataFromRequest } from '../../../../helpers/getUserDataFromRequest.helper';
import { GenerateRandom6DigitNumber } from '../../../../helpers/GenerateRandom5DigitNumber';
import { dataOfChangingVaultPasswordRequest } from '../../../../data/temporaryData';
import { sendVaultPasswordResetTokenToEmail } from '../../../../helpers/sendVaultPasswordResetToken.controller';

export const forgotVaultPasswordController = myControllerHandler(
  async (req, res) => {
    const { newVaultPassword } = req.body;
    const userData: any = await getUserDataFromRequest(req);

    if (!newVaultPassword) {
      throw new Error('please enter new vault password');
    }
    if (newVaultPassword) {
    }
    const passwordHashOfNewVaultPassword = await hashMyPassword(
      newVaultPassword
    );
    const token = GenerateRandom6DigitNumber();
    const dataToSave = {
      newVaultPasswordHash: passwordHashOfNewVaultPassword,
      userId: userData.id,
      token,
    };
    await sendVaultPasswordResetTokenToEmail(userData.email, token);

    dataOfChangingVaultPasswordRequest.push(dataToSave);
    const myResponse = {
      message: 'Token Sent to email successfully',
      success: true,
      token,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
