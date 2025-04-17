import express from 'express';
import { getSubscriptionPackagesController } from '../controller/getSubscriptionPackages.controller';
import { buySubscriptionPackagesController } from '../controller/buySubscriptionPackages.controller copy';
import { saveNewSubscriptionPackagesController } from '../controller/saveNewTransactionData.controller';
import { getSingleSubscriptionPackagesController } from '../controller/getSingleSubscriptionPackages.controller';
import { completeSubscriptionInFrontendController } from '../controller/completeSubscriptionInFrontendAndSendPaymentDataInBackend.controller';

const subscriptionPackagesRouter = express.Router();

subscriptionPackagesRouter.get('/', getSubscriptionPackagesController);
subscriptionPackagesRouter.get('/:id', getSingleSubscriptionPackagesController);
subscriptionPackagesRouter.post('/buy', buySubscriptionPackagesController);
subscriptionPackagesRouter.post('/save', saveNewSubscriptionPackagesController);
subscriptionPackagesRouter.post(
  '/complete-subscription-payment-from-the-frontend-and-send-payment-data-to-backend',
  completeSubscriptionInFrontendController
);

export { subscriptionPackagesRouter };
