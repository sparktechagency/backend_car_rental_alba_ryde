import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import {
  getUserDataFromRequest,
  getUserDataFromRequestIfAny,
} from '../../../../helpers/getUserDataFromRequest.helper';
import {
  askPropertyBegger,
  askPropertyBegger2,
} from '../../../../helpers_v2/property_begger/propertyBegger.helper';
import { conversationModel } from '../model/conversation.model';
import { chatHistoryModel } from '../model/chatHistory.model';
import { extractLocationHelper } from '../../../../helpers_v2/property_begger/extractLocationWithAi.helper';
import { zooplaRapidApiAR7 } from '../../../../helpers_v2/zoopla/zooplaRapidApi.helper';
import { makeReplyWithPropertyHelper } from '../../../../helpers_v2/property_begger/makeWithfProperty.controller';

export const propertyChatController = myControllerHandler(async (req, res) => {
  const userData: any = await getUserDataFromRequestIfAny(req);
  let { message, conversationId } = req.body;
  let allMessages: any = [{ role: 'user', content: message }];

  if (!conversationId) {
    const newConversationData = await conversationModel.create({
      userId: userData ? userData.id : '',
    });
    conversationId = newConversationData.id;
  }
  if (conversationId) {
    const conversationData = await conversationModel.findOne({
      id: conversationId,
    });
    if (!conversationData) {
      throw new Error(`this conversition id '${conversationId}' is not valid`);
    }
  }

  const chatHistory = await chatHistoryModel
    .find({ conversationId })
    .sort({ createdAt: -1 }) // Assuming 'createdAt' is the timestamp field
    .limit(20); // Limit to 20 most recent messages

  allMessages = [...chatHistory.reverse(), ...allMessages];

  const locationData = (await extractLocationHelper(message)) as any;
  let propertyData = null as any;
  if (locationData.location) {
    const { location } = locationData;
    try {
      const propertyData2 = await zooplaRapidApiAR7(location, location);
      propertyData = propertyData2;
    } catch (error) {}
  }
  let answer = null as any;
  if (propertyData) {
    answer = await makeReplyWithPropertyHelper(message, propertyData);
  } else {
    answer = await askPropertyBegger2(allMessages);
  }

  await chatHistoryModel.create({
    conversationId: conversationId,
    sender: 'user',
    message: message,
  });
  await chatHistoryModel.create({
    conversationId: conversationId,
    sender: 'ai',
    message: answer,
  });

  const myResponse = {
    message: 'Message Fetched Successful',
    success: true,
    answer: answer,
    conversationId: conversationId,
  };
  res.status(StatusCodes.OK).json(myResponse);
});
