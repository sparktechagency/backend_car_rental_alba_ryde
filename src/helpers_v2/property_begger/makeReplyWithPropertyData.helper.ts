import axios from 'axios';
import { organizeMessages } from './organizeMessages.helper';
import { CHAT_GPT_API_KEY } from '../../data/environmentVariables';
import { getArrayElements } from '../array/cutArray.helper';
import { extractPropertyDetails } from '../property/extractPropertyDetails.helper';
const propertyAssistantInstructions = `
You are an assistant designed to process messages related to UK-based properties. You will receive various types of messages in different formats.

You will also receive conversation history along with fetched property data. Based on the conversation history, you will generate a message containing the fetched property data.

Always respond in a structured HTML format using Tailwind CSS classes to make the message visually appealing for frontend display.

Please always write the every single property in the list.

Make sure to deliver clean, complete, and consistent code in your responses at all times.
`;

export const getReplyWithPropertyData = (
  messagesHistory: any,
  propertyData: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refinedMessagesHistory = organizeMessages(messagesHistory);
      const refinedPropertyData = extractPropertyDetails(propertyData);
      console.log(refinedPropertyData);
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4', // or 'gpt-3.5-turbo' depending on which model you want to use
          messages: [
            {
              role: 'system',
              content: propertyAssistantInstructions,
            },
            {
              role: 'user',
              content:
                JSON.stringify(refinedMessagesHistory) +
                JSON.stringify({
                  fetchedPropertyData: refinedPropertyData,
                }),
            },
          ],
          max_tokens: 5000,
        },
        {
          headers: {
            Authorization: `Bearer ${CHAT_GPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const replyOfChatgpt = response.data.choices[0].message.content;

      resolve(replyOfChatgpt);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
