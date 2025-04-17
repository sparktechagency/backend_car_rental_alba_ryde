import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { dataOfChangingVaultPasswordRequest } from '../../../../data/temporaryData';
import { userModelOfMantled } from '../model/userModelOfMantled.model';

export const secondPhaseOfForgotVaultPasswordController = myControllerHandler(
  async (req, res) => {
    const { token } = req.body;
    const index = dataOfChangingVaultPasswordRequest.findIndex(
      (data: any) => data.token == token
    );
    if (index === -1) {
      throw new Error('This token is invalid');
    }

    const { newVaultPasswordHash, userId } =
      dataOfChangingVaultPasswordRequest[index];

    // Update the user's vault password
    await userModelOfMantled.findOneAndUpdate(
      {
        id: userId,
      },
      {
        vaultPasswordHash: newVaultPasswordHash,
      }
    );

    // Remove the token from the array using splice
    dataOfChangingVaultPasswordRequest.splice(index, 1);

    const myResponse = {
      message: 'Vault Password updated successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
