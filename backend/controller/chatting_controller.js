const User = require("../schema/user_schema");
const Message = require("../schema/messages_schema");
const Conversation = require("../schema/conversation_schema");

//util
const chatHelper = require("../utils/helperFunctions");

module.exports = {
  start_chat: function (io) {
    io.on("connection", function (socket) {
      console.log("user joined");

      //User joins a conversation room.
      socket.on("join_conversation", function (conversation_id) {
        socket.join(conversation_id);
      });

      //this is when the user become online
      socket.on("user_online", async function (user_data) {
        console.log("user_online was received:", user_data);
        try {
          socket.user_id = user_data.user_id;

          await User.findByIdAndUpdate(user_data.user_id, {
            user_status: "online",
          });

          //debugging
          const updated = await User.findById(user_data.user_id);
          console.log("AFTER UPDATE STATUS:", updated.user_status);

          io.emit("user_status_update", {
            user_id: user_data.user_id,
            status: "online",
          });
        } catch (err) {
          console.error("Error updating user status:", err);
        }
      });

      //when user start typing, show.
      socket.on("typing", function (data) {
        console.log("typing event received:", data);
        const roomId = String(data.conversation_id);
        socket.to(roomId).emit("typing", {
          conversation_id: data.conversation_id,
          user_id: data.user_id,
        });
      });

      //when user stop typing, hide,
      socket.on("stop_typing", function (data) {
        const roomId = String(data.conversation_id);
        socket.to(roomId).emit("stop_typing", {
          conversation_id: data.conversation_id,
          user_id: data.user_id,
        });
      });

      //simulate sending messages
      // simulate sending messages
      socket.on("send_message", async function (msg_data) {
        console.log("send_message received:", msg_data);
        try {
          if (!msg_data.sender_id || !msg_data.receiver_id) {
            console.error("Missing sender_id or receiver_id");
            return;
          }

          const conversation = await chatHelper.getOrCreateConversation(
            msg_data.sender_id,
            msg_data.receiver_id
          );

          const saved_message = await Message.create({
            messages_content: msg_data.messages_content,
            sender_id: msg_data.sender_id,
            receiver_id: msg_data.receiver_id,
            conversation_id: conversation._id,
            message_type: msg_data.message_type || "text",
            message_status: "sent",
          });

          await Conversation.findByIdAndUpdate(conversation._id, {
            last_message: msg_data.messages_content,
            last_updatedAt: Date.now(),
          });

          socket.join(conversation._id.toString());

          // populate sender and receiver here
          const populatedMessage = await Message.findById(saved_message._id)
            .populate(
              "sender_id",
              "user_first_name user_last_name user_profile_img user_status"
            )
            .populate(
              "receiver_id",
              "user_first_name user_last_name user_profile_img user_status"
            );

          io.to(conversation._id.toString()).emit(
            "receive_message",
            populatedMessage
          );
        } catch (err) {
          console.error("Error sending message:", err);
        }
      });

      //next is, after message receieve, if user seen it, the mark as seen
      socket.on("message_seen", async function (data) {
        try {
          await Message.findByIdAndUpdate(data.message_id, {
            message_status: "seen",
          });
          io.to(data.conversation_id).emit("update_seen_status", data);
        } catch (err) {
          console.error("Error updating message status:", err);
        }
      });

      //now we handle user status change
      socket.on("status_change", async function (data) {
        console.log("status_change received:", data);
        try {
          await User.findByIdAndUpdate(data.user_id, {
            user_status: data.status,
          });

          io.emit("user_status_update", data);
        } catch (err) {
          console.error("Error updating user status:", err);
        }
      });

      //now we disconnect user
      socket.on("disconnect", async function () {
        console.log("User disconnected:", socket.id);

        try {
          //update user status to offline
          if (socket.user_id) {
            await User.findByIdAndUpdate(socket.user_id, {
              user_status: "offline",
            });
            //Notify all clients about the user status update
            io.emit("user_status_update", {
              user_id: socket.user_id,
              status: "offline",
            });
          }
        } catch (err) {
          console.error("Error handling disconnect:", err);
        }
      });
    });
  },

  startConversation: async function (req, res) {
    try {
      const userId = req.user._id;
      const { receiver_id } = req.body;

      if (!receiver_id) {
        console.log("testing receiver", receiver_id);
        return res.status(400).json({ message: "Receiver ID is required" });
      }
      let convo = await Conversation.findOne({
        participants: { $all: [userId, receiver_id] },
      });

      if (!convo) {
        convo = await Conversation.create({
          participants: [userId, receiver_id],
          last_updatedAt: Date.now(),
        });
      }

      return res.status(200).json({ conversation: convo });
    } catch (err) {
      console.error("Error starting conversation:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // List conversations for a user
  listConversations: async function (req, res) {
    try {
      //we only need the id since participants expect an arrays of Ids not the whole object
      const userId = req.user._id;

      const conversations = await Conversation.find({
        participants: userId,
      })
        .populate({
          path: "participants",
          select: "user_first_name user_last_name user_profile_img user_status",
        })
        .sort({ last_updatedAt: -1 });

      console.log("DEBUG found conversations:", conversations);

      return res.status(200).json({ conversations });
    } catch (error) {
      console.error("Error listing messages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },

  // List messages in a conversation
  listMessages: async function (req, res) {
    try {
      const conversationId = req.params.conversation_id;
      if (!conversationId) {
        return res.status(400).json({ message: "Conversation ID is required" });
      }

      //seucrity checks
      const userId = req.user._id;
      const conversations = await Conversation.findById(conversationId);
      if (!conversations) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      //this part here is confusing
      // conversation.participants is an array of ObjectIds of users.
      // the .some() method check if AT LEAST one elemnt in the array matches the condition
      //means --> Is there any particpants ID that equals the logged-in user ID?
      //if yes, user belongs to convo, if no, user NOT belong to convo
      const isParticipant = conversations.participants.some(function (id) {
        return id.toString() === userId.toString(); //this will return true if .some() finds a match
      });
      //if user is not a participant, block access
      if (!isParticipant) {
        return res
          .status(403)
          .json({ message: "You are not a participant of this conversation" });
      }

      const messages = await Message.find({
        conversation_id: conversationId,
      })
        .populate(
          "sender_id",
          "user_first_name user_last_name user_profile_img user_status"
        )
        .populate(
          "receiver_id",
          "user_first_name user_last_name user_profile_img user_status"
        )
        .sort({ message_createdAt: 1 });

      return res.status(200).json({
        messages,
        conversation: conversations,
      });
    } catch (error) {
      console.error("Error listing messages:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
};
