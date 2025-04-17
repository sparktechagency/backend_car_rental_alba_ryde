import axios from 'axios';
import { organizeMessages } from './organizeMessages.helper';
import { CHAT_GPT_API_KEY } from '../../data/environmentVariables';
const propertyAssistantInstructions = `
You are an assistant designed to process messages related to UK-based properties. You will receive a variety of messages in different formats. 

- If the user is expecting property data for a specific location in the next reply, you will return that location as an object:  
  { "location": "city_name", "price_min":"minimum_price", "price_max":"maximum_price", "beds_min":"minimum_bed"  }, where "city_name" is the corrected name of the location. Keep the field empty that is not provided. 

- If the user asks about a location's name, or anything else that doesn't require property data for a location in the next reply, you will return:  
  { "location": null }. 

  

**Important:**  
- Always correct any misspellings or typos in location names (e.g., "oxfor" should be corrected to "oxford", and "londn" to "london").
- The locations you recognize are UK-based towns or cities only.  
- Only return property data if the user is expecting it for that location in the next reply.
`;
export const getLocationInfoIfThereIsAny2 = (messagesHistory: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refinedMessagesHistory = organizeMessages(messagesHistory);

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
              content: JSON.stringify(refinedMessagesHistory),
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
      const parsedData = JSON.parse(replyOfChatgpt);
      resolve(parsedData);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
