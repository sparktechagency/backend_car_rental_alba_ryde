export const organizeMessages = (allMessages: any) => {
  const refinedMessages = [] as any;
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
  return refinedMessages;
};
