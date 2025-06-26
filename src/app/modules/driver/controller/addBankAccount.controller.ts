import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest2 } from '../../../../helpers/getUserDataFromRequest.helper';

export const addBankAccountController = myControllerHandler(
  async (req, res) => {
    const userData = await getUserDataFromRequest2(req);
    const { bank_name, bank_account_number, branch_code } = req.body;
    if (!bank_name || !bank_account_number || !branch_code) {
      throw new Error(
        'please enter bank name, account number and branch code.'
      );
    }
    userData.nameOfTheBank = bank_name;
    userData.accountNumberOfTheBank = bank_account_number;
    userData.branchCodeOfBank = branch_code;
    await userData.save();
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: { userData },
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
