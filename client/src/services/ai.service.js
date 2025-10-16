// src/services/ai.service.js
import api from "../lib/axios";

const AIService = {
  /**
   * Gửi prompt để AI chat trả lời
   * @param {string} prompt - Câu hỏi hoặc nội dung bạn muốn AI phản hồi
   * @returns {Promise<any>}
   */
  chat: (prompt) => {
    return api.post("/ai/chat", { prompt });
  },

  /**
   * Gợi ý ý tưởng theo chủ đề
   * @param {string} topic - Chủ đề cần AI tạo ý tưởng
   * @returns {Promise<any>}
   */
  idea: (topic) => {
    return api.post("/ai/idea", { topic });
  },

  /**
   * Gửi ảnh base64 để AI phân tích / mô tả
   * @param {string} base64 - Dữ liệu ảnh base64
   * @param {string} [mimeType] - MIME type của ảnh (ví dụ "image/png" hoặc "image/jpeg")
   * @returns {Promise<any>}
   */
  vision: (base64, mimeType) => {
    return api.post("/ai/vision", { base64, mimeType });
  },
};

export default AIService;
