// backend/routes/mentorChats.routes.js
const router = require('express').Router();
const c = require('../controller/mentorChat.controller');
const { authRequired, roleRequired } = require('../middleware/auth.middleware');

// Lấy toàn bộ tin nhắn của 1 order (cả mentor & mentee đều xem được)
router.get('/order/:orderId', authRequired, c.list);

// Xem chi tiết 1 tin nhắn
router.get('/:id', authRequired, c.getOne);

// Gửi tin nhắn mới (mentor hoặc mentee đều được)
router.post('/', authRequired, roleRequired('MENTOR', 'MENTEE'), c.create);

// Sửa tin nhắn (người gửi hoặc admin)
router.patch('/:id', authRequired, c.update);

// Xóa tin nhắn (người gửi hoặc admin)
router.delete('/:id', authRequired, c.remove);

module.exports = router;
