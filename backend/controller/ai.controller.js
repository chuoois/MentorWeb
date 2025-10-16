const aiService = require("../business/ai.service");

exports.chatMentorAdvisor = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message)
      return res.status(400).json({ success: false, error: "Thiếu message!" });

    const data = await aiService.chatMentorAdvisor(message);
    res.json({ success: true, data });
  } catch (err) {
    console.error("[AI ERROR]", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
