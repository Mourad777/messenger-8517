const getLatestCurrUserReadMessage = (messages, userId) => {
  const readMessagesFromCurrentUser = messages.filter(m => {
    return m.senderId === userId && m.isRead
  });
  const lastCurrentUserReadMessage = readMessagesFromCurrentUser[readMessagesFromCurrentUser.length - 1] || {};

  return lastCurrentUserReadMessage
}


export const addConversationsToStore = (payload) => {
  const { userId, conversations } = payload

  const conversationsWithLatestMessage = conversations.map(convo => {
    const latestCurrentUserReadMessage = getLatestCurrUserReadMessage(convo.messages, userId);
    const isUnreadMessage = (convo.messages || [])
      .findIndex(m => !m.isRead && (m.senderId !== userId)) > -1;

    return {
      ...convo,
      latestCurrentUserReadMessage,
      isUnreadMessage,
    }

  });

  return conversationsWithLatestMessage
};

export const addMessageToStore = (state, payload) => {
  const { message, sender, userId } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {

    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;

    newConvo.latestCurrentUserReadMessage = getLatestCurrUserReadMessage(newConvo.messages, userId);
    newConvo.isUnreadMessage = true;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const convoCopy = { ...convo };
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      convoCopy.latestCurrentUserReadMessage = getLatestCurrUserReadMessage(convo.messages, userId);

      const isUnreadMessage =
        convoCopy.messages
          .findIndex(m => !m.isRead && m.senderId !== userId) > -1;

      convoCopy.isUnreadMessage = isUnreadMessage;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const markConversationAsRead = (state, payload) => {
  const { conversationId, userId } = payload;
  return state.map((convo) => {
    if (convo.id === conversationId) {
      const convoCopy = { ...convo };
      const updatedMessages = convoCopy.messages.map(m => {
        return { ...m, isRead: true }
      });
      console.log('markConversationAsRead ^^^^^^^%%%%%%%%%%%^^^^^^^^^^^^userId',userId)
      const lastCurrentUserReadMessage = getLatestCurrUserReadMessage(updatedMessages, userId);
      convoCopy.latestCurrentUserReadMessage = lastCurrentUserReadMessage;
      convoCopy.isUnreadMessage = false;
      return { ...convoCopy, messages: updatedMessages };
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  console.log('new convo add to store fired!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const convoCopy = { ...convo };
      convoCopy.id = message.conversationId;
      convoCopy.messages.push(message);
      convoCopy.latestMessageText = message.text;
      // convoCopy.latestCurrentUserReadMessage = null;
      convoCopy.isUnreadMessage = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
}
