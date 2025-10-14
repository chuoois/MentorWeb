// backend/business/ai.service.js
require('dotenv').config();

let _client; // cache singleton

async function getClient() {
  if (_client) return _client;
  const { GoogleGenAI } = await import('@google/genai'); // ESM -> dynamic import cho CJS
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing GEMINI_API_KEY');
  _client = new GoogleGenAI({ apiKey });
  return _client;
}

/** Chat ngắn gọn */
exports.askGemini = async (prompt) => {
  const client = await getClient();
  const res = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt || 'Xin chào từ MentorWeb!',
  });
  // SDK mới: .response.text()
  return res?.response?.text() ?? '';
};

/** Structured JSON: ép model trả JSON theo schema */
exports.generateIdeaJson = async (topic) => {
  const client = await getClient();
  const res = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Hãy tạo một ý tưởng về: ${topic}`,
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } },
          summary: { type: 'string' }
        },
        required: ['title','tags','summary'],
        additionalProperties: false
      },
      // Nếu muốn tiết kiệm chi phí/tốc độ:
      // thinkingConfig: { thinkingBudget: 0 }
    }
  });
  const text = res?.response?.text() ?? '{}';
  return JSON.parse(text);
};

/** Vision (ảnh inline base64) */
exports.describeImageBase64 = async (base64, mime = 'image/jpeg') => {
  const client = await getClient();
  const res = await client.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
      { role: 'user', parts: [
        { text: 'Mô tả ngắn gọn bức ảnh này.' },
        { inlineData: { mimeType: mime, data: base64 } }
      ] }
    ]
  });
  return res?.response?.text() ?? '';
};
