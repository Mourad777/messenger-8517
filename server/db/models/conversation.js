const { Op } = require("sequelize");
const db = require("../db");
const User = require("./user");

const Conversation = db.define("conversation", {
  adminId: {
    type: Sequelize.INTEGER,
    allowNull: true, //admin can be null if not group conversation
    references: {
      model: User,
      key: 'id'
    }
  },
});

// find conversation given list of user Ids
// this function will only be run for 1 to 1 conversations
Conversation.findConversation = async function (userIds) {
  const conversation = await Conversation.findOne({
    where: {
      users: {
        [Op.in]: [userIds]
      },
    },
  });

  // return conversation or null if it doesn't exist
  return conversation;
};

module.exports = Conversation;