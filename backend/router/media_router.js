const express = require("express");
const router = express.Router();
const mediaController = require("../controller/media_controller");
const auth = require("../middleware/auth");

router.post("/like/api/:id", auth, mediaController.toggleLike);
router.post("/add/comment/api/:id", auth, mediaController.addComment);
router.get("/list/comments/api/:id", auth, mediaController.listComment)
module.exports = router;
