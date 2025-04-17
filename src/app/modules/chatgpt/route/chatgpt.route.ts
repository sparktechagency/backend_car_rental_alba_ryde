import express from 'express';
import { sendMessageAndGetResponseFromChatGptController } from '../controller/sendMessageAndGetResponseFromChatGpt.controller';

const chatGptRouter = express.Router();

chatGptRouter.post(
  '/send-message-and-get-response-from-chatgpt',
  sendMessageAndGetResponseFromChatGptController
);

export { chatGptRouter };
