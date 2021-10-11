const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");

// associations

User.hasMany(Conversation);
Conversation.belongsToMany(User);

Conversation.hasMany(Message);
Message.belongsTo(Conversation);

//group conversations have 1 admin that can add/remove other users from the convo
Conversation.belongsTo(User, { foreignKey: 'userId', as: 'admin' });

module.exports = {
  User,
  Conversation,
  Message
};
