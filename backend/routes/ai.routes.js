// backend/routes/ai.routes.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const c = require('../controller/ai.controller');
const { authMiddleware } = require('../middleware/auth.middleware'); // nếu muốn khóa theo user

const router = express.Router();

// Giới hạn tránh abuse (tùy chỉnh theo nhu cầu)
const limiter = rateLimit({
  windowMs: 60_000, // 1 phút
  max: 20,          // 20 requests/phút cho mỗi IP
});

router.use(express.json({ limit: '2mb' }));
router.use(limiter);

// Nếu bạn muốn bắt buộc đăng nhập mới dùng AI:
// router.use(authMiddleware);

router.post('/chat', c.chat);   // POST /api/ai/chat       { prompt }
router.post('/idea', c.idea);   // POST /api/ai/idea       { topic }
router.post('/vision', c.vision); // POST /api/ai/vision   { base64, mimeType? }

module.exports = router;