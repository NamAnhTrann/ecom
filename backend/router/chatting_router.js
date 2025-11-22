const express = require("express");
const router = express.Router();
const chatting_controller = require("../controller/chatting_controller");
const auth = require("../middleware/auth");

router.get("/chat/list", auth, chatting_controller.listConversations);
router.get("/chat/messages/:conversation_id", auth, chatting_controller.listMessages);

module.exports = router;
