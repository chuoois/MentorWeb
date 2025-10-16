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
Bạn là hệ thống AI tư vấn chọn mentor phù hợp nhất cho mentee.

Dưới đây là danh sách mentor dưới dạng JSON:
mentors = ${contextJson}

Hãy đọc yêu cầu của mentee và chọn ra **tối đa 3 mentor phù hợp nhất**.
Chỉ trả về JSON hợp lệ, không thêm text khác ngoài JSON.

Cấu trúc JSON bắt buộc:
{
  "recommended": [
    {
      "mentorId": "<_id>",
      "full_name": "<tên mentor>",
      "reason": "<lý do chọn>",
      "link": "/api/mentors/<_id>"
    }
  ]
}

Yêu cầu mentee: ${userMessage}
`;

  const result = await this.model.generateContent(prompt);
  const text = result.response.text().trim();

  // 💡 Tự động parse nếu JSON bị trả dưới dạng string
  try {
    // Nếu Gemini trả JSON chuẩn
    return JSON.parse(text);
  } catch {
    // Nếu Gemini trả text có JSON nằm bên trong, thì cố gắng bóc tách
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart >= 0 && jsonEnd > jsonStart) {
      const possibleJson = text.slice(jsonStart, jsonEnd + 1);
      try {
        return JSON.parse(possibleJson);
      } catch {
        return { raw: text }; // fallback cuối
      }
    }
    return { raw: text };
  }
}
}

// 👇 Đây là phần QUAN TRỌNG
module.exports = new AiService();
