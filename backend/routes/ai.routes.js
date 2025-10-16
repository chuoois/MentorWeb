// routes/ai.routes.js
const express = require("express");
const router = express.Router();
const aiController = require("../controller/ai.controller");

router.post("/chat-mentor", aiController.chatMentorAdvisor);

module.exports = router;
