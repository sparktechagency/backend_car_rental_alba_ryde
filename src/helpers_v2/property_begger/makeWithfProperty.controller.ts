import axios from 'axios';
import { CHAT_GPT_API_KEY } from '../../data/environmentVariables';
import { getArrayElements } from '../array/cutArray.helper';

export const makeReplyWithPropertyHelper = (
  message: string,
  propertyData: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refinedData = getArrayElements(propertyData.regular, 5);

      // Constructing the system message for context
      const systemMessage = `
        You are an AI assistant helping to answer property-related inquiries. 
        You will receive two pieces of information:
        1. The user’s query (message).
        2. The fetched property data (propertyData).
        
        Your task is to provide a relevant response based on the user's message and the property data provided. 
        Tailor your reply to match the user's request, e.g., if the user asks for property suggestions, your response might include available properties, or if they ask for more details, provide the relevant information accordingly.
        
        If the message contains a location or specific criteria, make sure to prioritize the relevant property information in the response. 
        Always structure your response in a natural, conversational way.
      `;

      const userMessage = message + ' ' + JSON.stringify(refinedData); // Including propertyData in message context

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4', // You can also use 'gpt-3.5-turbo' depending on your preference
          messages: [
            {
              role: 'system',
              content: systemMessage,
            },
            {
              role: 'user',
              content: userMessage,
            },
          ],
          max_tokens: 1000, // You can adjust the token limit based on your needs
        },
        {
          headers: {
            Authorization: `Bearer ${CHAT_GPT_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const replyOfChatgpt = response.data.choices[0].message.content;

      // Parsing the response if it's structured data
      try {
        const parsedData = JSON.parse(replyOfChatgpt);
        resolve(parsedData);
      } catch (parseError) {
        // Handle the case where the response is not JSON
        resolve(replyOfChatgpt); // If it's plain text
      }
    } catch (error) {
      console.error('Error in generating response with GPT:', error);
      reject(error); // Reject with the error
    }
  });
};
