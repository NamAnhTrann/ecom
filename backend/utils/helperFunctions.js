const Conversation = require("../schema/conversation_schema");

module.exports = {
  //chat helper function
  getOrCreateConversation: async function (userA, userB) {
    try {
      //Check if conversation already exists
      let existingConversation = await Conversation.findOne({
        participants: { $all: [userA, userB] },
      });

      //if it does exist, return it
      if (existingConversation) {
        return existingConversation;
      }

      //if the conversation doesnt exist, then create it (new convo object)
      const newConversation = await Conversation.create({
        participants: [userA, userB],
        last_message: "",
        last_updatedAt: Date.now(),
      });

      //return the new conversation
      return newConversation;
    } catch (error) {
      console.error("Error getting or creating conversation:", error);
      throw error;
    }
  },
};
