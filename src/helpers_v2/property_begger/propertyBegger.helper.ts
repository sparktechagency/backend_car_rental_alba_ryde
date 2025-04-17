import axios from 'axios';
import { CHAT_GPT_API_KEY } from '../../data/environmentVariables';

export const askPropertyBegger = (question: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4', // or 'gpt-3.5-turbo' depending on which model you want to use
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant who is a specialist of property specially in uk who always replies in simple paragraph format without any extra formatting like bullet points or new line or code blocks.`,
            },
            { role: 'user', content: question },
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
      resolve(replyOfChatgpt);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
export const askPropertyBegger2 = (allMessages: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const refinedMessages: any = [];
      for (let i = 0; i < allMessages.length; i++) {
        const singleData = allMessages[i];
        const myMessageData: any = {};
        const message = singleData?.message;
        if (message) {
          myMessageData.content = message;
        }
        const sender = singleData?.sender;
        if (sender) {
          if (sender === 'ai') {
            myMessageData.role = 'assistant';
          } else if (sender === 'user') {
            myMessageData.role = 'user';
          }
        }
        const role = singleData.role;
        if (role) {
          myMessageData.role = role;
        }
        const content = singleData.content;
        if (content) {
          myMessageData.content = content;
        }

        refinedMessages.push(myMessageData);
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4', // or 'gpt-3.5-turbo' depending on which model you want to use
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant who is a specialist of property specially in uk who always replies in simple paragraph format without any extra formatting like bullet points or new line or code blocks.`,
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
      const replyOfChatgpt = response.data.choices[0].message.content;
      resolve(replyOfChatgpt);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};
