import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequest } from '../../../../helpers/getUserDataFromRequest.helper';
import { PaymentModel } from '../../payment_v2/model/payment.model';
type PaymentData = {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: {
    tip: Record<string, unknown>;
  };
  amount_received: number;
  application: string | null;
  application_fee_amount: number | null;
  automatic_payment_methods: string | null;
  canceled_at: number | null;
  cancellation_reason: string | null;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: string | null;
  description: string | null;
  invoice: string | null;
  last_payment_error: string | null;
  latest_charge: string | null;
  livemode: boolean;
  metadata: Record<string, unknown>;
  next_action: string | null;
  on_behalf_of: string | null;
  payment_method: string | null;
  payment_method_configuration_details: string | null;
  payment_method_options: {
    card: {
      brand: string;
      last4: string;
    };
  };
  payment_method_types: string[];
  processing: string | null;
  receipt_email: string | null;
  review: string | null;
  setup_future_usage: string | null;
  shipping: string | null;
  source: string | null;
  statement_descriptor: string | null;
  statement_descriptor_suffix: string | null;
  status: string;
  transfer_data: string | null;
  transfer_group: string | null;
};

export const completeSubscriptionInFrontendController = myControllerHandler(
  async (req, res) => {
    const paymentData: PaymentData = req.body.payment_data;
    const subscriptionId = req.body.subscription_id;
    const userData: any = await getUserDataFromRequest(req);
    const {
      amount,
      currency,
      id,
      payment_method,
      payment_method_options,
      status,
    } = paymentData;
    const userId = userData.id;
    await PaymentModel.create({
      userId,
      amount,
      currency,
      transactionId: id,
      packageId: subscriptionId,
      paymentMethod: payment_method,
      cardBrand: payment_method_options.card.brand,
      last4: payment_method_options.card.last4,
      status,
    });
    console.log('Request of complete payment from frontend');
    const myResponse = {
      message: 'Review Given Successfully',
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  }
);
