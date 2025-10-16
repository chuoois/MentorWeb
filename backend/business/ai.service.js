// business/ai.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Mentor = require("../models/mentor.model");

class AiService {
  constructor() {
    this.client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.client.getGenerativeModel({ model: "models/gemini-2.5-flash" });
  }

  async getMentorContext() {
  const mentors = await Mentor.find({ status: "ACTIVE" })
    .select("_id full_name job_title company category skill bio location price")
    .lean();

  // Đưa dữ liệu JSON dạng đơn giản cho AI
  return JSON.stringify(mentors, null, 2);
}

  async chatMentorAdvisor(userMessage) {
  const contextJson = await this.getMentorContext();

  const prompt = `
  Bạn là AI tư vấn chọn mentor phù hợp cho mentee.
  Dưới đây là danh sách mentor dưới dạng JSON:

  mentors = ${contextJson}

  - Mỗi mentor có "_id", "full_name", "job_title", "skill", "bio", "price", "location".
  - Dựa trên yêu cầu mentee, hãy chọn mentor phù hợp nhất.
  - Trả về kết quả ở định dạng JSON có dạng như sau:

  {
    "recommended": {
      "_id": "...",
      "full_name": "...",
      "reason": "...",
      "link": "/api/mentors/<_id>"
    },
    "alternatives": [
      { "_id": "...", "full_name": "...", "reason": "...", "link": "/api/mentors/<_id>" },
      ...
    ]
  }

  Yêu cầu của mentee: ${userMessage}
  `;

  const result = await this.model.generateContent(prompt);

  // Trả về JSON đã parse
  const text = result.response.text().trim();

  try {
    const json = JSON.parse(text);
    return json;
  } catch {
    // Nếu Gemini trả text không chuẩn JSON, trả về raw text
    return { raw: text };
  }
}
}

// 👇 Đây là phần QUAN TRỌNG
module.exports = new AiService();
