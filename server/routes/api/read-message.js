const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
    try {
        const unreadMessageIds = req.body;

        await Message.update({ isRead: true }, { where: { id: unreadMessageIds } });

        const updatedMessages = await Message.findAll({ where: { id: unreadMessageIds } });

        const isUnreadMessage = updatedMessages.findIndex(m => !m.isRead) > -1;

        return res.json({ allMessagesRead: !isUnreadMessage });

    } catch (e) {

        next(error);
        
    }

});

module.exports = router;
