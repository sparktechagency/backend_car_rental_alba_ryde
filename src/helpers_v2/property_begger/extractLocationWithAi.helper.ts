import axios from 'axios';
import { CHAT_GPT_API_KEY } from '../../data/environmentVariables';

export const extractLocationHelper = (message: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4', // or 'gpt-3.5-turbo' depending on which model you want to use
          messages: [
            {
              role: 'system',
              content: `
    You are an assistant designed to process messages related to UK-based properties. 
    You will receive queries in various formats, such as:
    - "Are there any properties in Cambridge?"
    - "Suggest me some properties in cambridge"
    - or similar variations.
    
    Your task is to extract the location mentioned in the query. If a valid UK location is found, return it in the following format:
    { "location": "cambridge" }
    If no location is mentioned, or if it's unclear, return:
    { "location": null }

    You should also correct any misspellings or typos in location names. For example:
    - "oxfor" should be corrected to "oxford"
    - "londn" should be corrected to "london"

    The locations you recognize are all UK-based, and you should only return UK cities or towns.
  `,
            },
            {
              role: 'user',
              content: message,
            },
          ],
          max_tokens: 1000,
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
