import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import { getUserDataFromRequestIfAny } from '../../../../helpers/getUserDataFromRequest.helper';
import { conversationModel } from '../model/conversation.model';
import { chatHistoryModel } from '../model/chatHistory.model';
import { getLocationInfoIfThereIsAny2 } from '../../../../helpers_v2/property_begger/getLocationInfoIfAny2.helper';
import { askChatGpt } from '../../../../helpers_v2/property_begger/askChatGpt.helper';
import { zooplaRapidApiAR7_2 } from '../../../../helpers_v2/zoopla/zooplaRapidApi.helper';

export const propertyChatController2 = myControllerHandler(async (req, res) => {
  // Get user data from request (if any)
  const userData = (await getUserDataFromRequestIfAny(req)) as any;

  // Get message and conversationId from request body
  let { message, conversationId } = req.body;

  // Determine if this is a new conversation or an old one
  const isNewConversation = !conversationId;
  const isOldConversation = !isNewConversation;

  let conversationData;

  // If it's an old conversation, find the conversation data
  if (isOldConversation) {
    conversationData = await conversationModel.findOne({
      id: conversationId,
    });

    // Throw error if conversation is not found
    if (!conversationData) {
      throw new Error('This conversation ID is not valid');
    }
  } else {
    // If it's a new conversation, create a new one
    conversationData = await conversationModel.create({
      userId: userData ? userData.id : '',
    });
  }

  // Get the chat history for the conversation (limit to 20 recent messages)
  const chatHistory = await chatHistoryModel
    .find({
      conversationId,
      sender: { $in: ['user', 'ai'] }, // Only messages from user or AI
    })
    .sort({ createdAt: -1 }) // Sort messages by creation time (most recent first)
    .limit(20); // Limit to 20 messages

  // Reverse the chat history and add the user's current message
  const last10MessagesHistory = [
    ...chatHistory.reverse(),
    { role: 'user', content: message },
  ];

  // Get location info if there is any in the chat history
  const locationData = (await getLocationInfoIfThereIsAny2(
    last10MessagesHistory
  )) as any;
  const location = locationData.location;

  // Initialize variables for AI's reply and property data
  let aiReply;
  let propertyData = null;

  // If no location, ask AI for a response
  if (!location) {
    aiReply = await askChatGpt(last10MessagesHistory);
  } else {
    // If there's a location, fetch property data based on the location
    propertyData = await zooplaRapidApiAR7_2(locationData);
  }

  // Save the user's message to chat history
  await chatHistoryModel.create({
    conversationId: conversationData.id,
    sender: 'user',
    message: message,
  });

  // If there's no property data, save AI's reply
  if (!propertyData) {
    await chatHistoryModel.create({
      conversationId: conversationData.id,
      sender: 'ai',
      message: aiReply,
    });
  }

  // If there is property data, save it to the chat history as a message from "zoopla"
  if (propertyData) {
    await chatHistoryModel.create({
      conversationId: conversationData.id,
      sender: 'zoopla',
      message: JSON.stringify(propertyData),
    });
  }

  // Prepare the response with AI's reply, success status, conversation data, and property data
  const response = {
    message: aiReply,
    success: true,
    data: {},
    conversationData,
    propertyData,
  };

  // Send the response back to the client with a success status code
  res.status(StatusCodes.OK).json(response);
});
