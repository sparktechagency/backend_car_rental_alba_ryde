import { StatusCodes } from 'http-status-codes';
import { myControllerHandler } from '../../../../utils/controller/myControllerHandler.utils';
import axios from 'axios';
import { CHAT_GPT_API_KEY } from '../../../../data/environmentVariables';

export const sendMessageAndGetResponseFromChatGptController =
  myControllerHandler(async (req, res) => {
    const { message } = req.body;
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4', // or 'gpt-3.5-turbo' depending on which model you want to use
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant who always replies in simple paragraph format without any extra formatting like bullet points or new line or code blocks.`,
          },
          { role: 'user', content: message },
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
    const myResponse = {
      answer: replyOfChatgpt,
      success: true,
      data: {},
    };
    res.status(StatusCodes.OK).json(myResponse);
  });
