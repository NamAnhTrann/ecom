const express = require("express");
const router = express.Router();
const chatting_controller = require("../controller/chatting_controller");
const auth = require("../middleware/auth");

router.get("/chat/list/api", auth, chatting_controller.listConversations);
router.get("/chat/messages/:conversation_id/api", auth, chatting_controller.listMessages);
router.post("/chat/start/api", auth, chatting_controller.startConversation)
module.exports = router;
