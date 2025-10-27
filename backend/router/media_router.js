const express = require("express");
const router = express.Router();
const mediaController = require("../controller/media_controller");
const auth = require("../middleware/auth");

router.post("/like/api/:id", auth, mediaController.toggleLike);

module.exports = router;
