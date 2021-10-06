export const getLatestCurrUserReadMessage = (messages, userId) => {
    const readMessagesFromCurrentUser = messages.filter(message => {
        return message.senderId === userId && message.isRead
    });
    const lastCurrentUserReadMessage = readMessagesFromCurrentUser[readMessagesFromCurrentUser.length - 1] || {};

    return lastCurrentUserReadMessage
}