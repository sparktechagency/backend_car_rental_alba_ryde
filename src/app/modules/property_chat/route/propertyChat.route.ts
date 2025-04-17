import express from 'express';
import { propertyChatController } from '../controller/propertyChat.controller';
import { getPropertyDataWithZooplaRapidController } from '../controller/getPropertyDataWithZooplaRapidApi.controller';
import { extractLocationDataFromNLController } from '../controller/extractLocationDataFromNL.controller';
import { propertyChatController2 } from '../controller/propertyChat2.controller';

const router = express.Router();

router.post('/chat-about-property', propertyChatController);
router.post('/chat-about-property-2', propertyChatController2);
router.post(
  '/get-property-data-with-zoopla-rapid-api',
  getPropertyDataWithZooplaRapidController
);
router.post('/extract-location-from-nl', extractLocationDataFromNLController);

export const propertyChatRouter = router;
