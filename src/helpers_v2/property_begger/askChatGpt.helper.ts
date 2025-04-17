import axios from 'axios';
import { organizeMessages } from './organizeMessages.helper';
import { CHAT_GPT_API_KEY } from '../../data/environmentVariables';
import { removeNewLines } from '../string/removeNewLines.helper';
import { removeBackslashes } from '../string/removeBackSlashes.helper';

const instructionForAi = `You are a helpful assistant who is a specialist in UK properties. Always reply in structured HTML format using Tailwind CSS classes to make it visually appealing for frontend display. Your response should include clear headings, descriptive paragraphs, and optionally styled sections (such as location info, price range, and property type). Do not use markdown or code formatting—only valid HTML output with Tailwind classes. Keep responses concise, informative, and well-structured for web presentation.
`;
export const askChatGpt = (allMessages: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refinedMessages = organizeMessages(allMessages);
      console.log(refinedMessages);

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4', // or 'gpt-3.5-turbo' depending on which model you want to use
          messages: [
            {
              role: 'system',
              content: instructionForAi,
            },
            ...refinedMessages,
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
      let replyOfChatgpt = response.data.choices[0].message.content;
      replyOfChatgpt = removeNewLines(replyOfChatgpt);
      replyOfChatgpt = removeBackslashes(replyOfChatgpt);
      console.log(replyOfChatgpt);
      resolve(replyOfChatgpt);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
