import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import sendResponse from '../../../../shared/sendResponse';
import { checkIfUserRequestingAdmin3 } from '../../../../helpers/checkIfRequestedUserAdmin';
import { getDataFromFormOfRequest } from '../../../../helpers/getDataFromFormAR7';
import { TempModel } from '../model/invoiceRequest.model';
import { saveAndGiveRefinedUrl } from '../../../../helpers/saveAndGiveRefinedLink';
import { TripModel } from '../../trip/model/trip.model';

export const uploadInvoiceOfPaymentToDriverController = myControllerHandler(
  async (req, res) => {
    await checkIfUserRequestingAdmin3(req);
    const myFormData = await getDataFromFormOfRequest(req);
    let withdrawId = myFormData.fields.id;
    if (!withdrawId) {
      throw new Error('invalid request, plz enter withdrawId');
    }
    withdrawId = withdrawId[0];
    const withdrawData = await TempModel.findOne({ id: withdrawId });
    if (!withdrawData) {
      throw new Error(
        'data does not exist with this id. invalid or expired id'
      );
    }
    let invoiceImage = myFormData.files.invoice_image;
    if (!invoiceImage) {
      throw new Error('please enter a invoice image');
    }
    invoiceImage = invoiceImage[0];
    const imagePath = await saveAndGiveRefinedUrl(
      invoiceImage,
      './public/images/invoice'
    );
    const refinedWithdrawData = JSON.parse(withdrawData.data);
    const arrayOfTripIds = refinedWithdrawData.tripIds;

    for (let i = 0; i < arrayOfTripIds.length; i++) {
      const singleTripId = arrayOfTripIds[i];
      const tripData = await TripModel.findOne({ id: singleTripId });
      if (!tripData) {
        continue;
      }
      tripData.imageOfPaymentInvoiceToDriver = imagePath;
      tripData.isPaymentReceivedByDriver = true;
      await tripData.save();
    }

    sendResponse(res, {
      code: StatusCodes.OK,
      message: 'payment made successfully',
      data: {},
    });
  }
);
