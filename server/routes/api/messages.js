const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");
// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender, userId: req.user.id });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });

    res.json({
      message,
      sender,
      userId: req.user.id,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/read", async (req, res, next) => {

  const userId = req.user.id;

  try {
    const { conversationId } = req.body;

    const populatedConvo = await Conversation.findOne({
      where: {
        id: conversationId,
      },
      include: [{
        model: Message,
      }]
    });

    const user1Id = populatedConvo.user1Id;
    const user2Id = populatedConvo.user2Id;

    if (!(user1Id === userId || user2Id === userId)) {
      return res.sendStatus(403);
    }

    await Message.update({ isRead: true }, { where: { conversationId, isRead: false } })

    const latestReadMessageRecipient = await Message.findOne({
      where: {
        isRead: true,
        conversationId,
        senderId: {
          [Op.not]: userId
        }
      },
      order: [['createdAt', 'DESC']],
    });

    return res.json({ latestReadMessageIdRecipient: latestReadMessageRecipient.id });

  } catch (e) {

    next(e);
  }

});

module.exports = router;