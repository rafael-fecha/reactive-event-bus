import { MessagesDataState } from '../interfaces/message-data-state.interface';

/**
 * Finds the given message in the behavior subject messages array values.
 *
 * param {string} message - message that we want to find if it is in the array.
 * param {MessagesDataState[]} messagesValues - current behavior subject messages array values.
 *
 * returns {MessagesDataState} - the message object found in the behavior subject messages array values.
 */
export function filterDesiredMessage(
  messageType: string,
  messagesValues: MessagesDataState[]
): MessagesDataState {
  return messagesValues.find((message) => message.type === messageType);
}

export const getDesiredMessageData = (messages: MessagesDataState[], desiredMessage: string) => {
  const message: MessagesDataState = filterDesiredMessage(desiredMessage, messages);
  if (message) {
    return message.data;
  }
};

export const hasAlreadyMessageDataStored = (messageValues: MessagesDataState[], messageType: string): boolean => {
  return messageValues.some((message) => message.type === messageType);
};

export const updateMessageData = (value: unknown, messageToUpdate: string, messages: MessagesDataState[]) => {
  return messages.map((message) => {
    return message.type === messageToUpdate ? { type: message.type, data: value} : message;
  })
}