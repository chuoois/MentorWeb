// backend/controller/ai.controller.js
const ai = require('../business/ai.service');

exports.chat = async (req, res, next) => {
  try {
    const { prompt } = req.body || {};
    const text = await ai.askGemini(prompt);
    res.json({ ok: true, text });
  } catch (err) { next(err); }
};

exports.idea = async (req, res, next) => {
  try {
    const { topic } = req.body || {};
    if (!topic) return res.status(400).json({ ok:false, message:'topic is required' });
    const data = await ai.generateIdeaJson(topic);
    res.json({ ok: true, data });
  } catch (err) { next(err); }
};

exports.vision = async (req, res, next) => {
  try {
    const { base64, mimeType } = req.body || {};
    if (!base64) return res.status(400).json({ ok:false, message:'base64 is required' });
    const text = await ai.describeImageBase64(base64, mimeType || 'image/jpeg');
    res.json({ ok: true, text });
  } catch (err) { next(err); }
};
