// src/services/ai.service.js
import api from "../lib/axios";

const AIService = {
  chatMentorAdvisor: (message) => {
    return api.post("/ai/chat-mentor", message);
  }
};

export default AIService;
