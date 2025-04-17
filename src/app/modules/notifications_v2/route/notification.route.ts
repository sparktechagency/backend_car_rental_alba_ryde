import express from 'express';
import { getNotificationController } from '../controller/getNotification.controller';

const notificationRouterV2 = express.Router();

notificationRouterV2.get('/', getNotificationController);

export { notificationRouterV2 };
