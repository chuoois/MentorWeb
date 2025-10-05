// backend/routes/mentorChats.routes.js
const router = require('express').Router();
const c = require('../controller/mentorChat.controller.js');
const { authRequired, roleRequired } = require('../middleware/auth.middleware.js');

// Xem tin nhắn theo order
router.get('/order/:orderId', authRequired, c.listByOrder);

// Gửi tin nhắn (chỉ mentor & mentee trong order đó)
router.post('/', authRequired, roleRequired('MENTEE', 'MENTOR'), c.create);

// Admin có thể xoá tin nhắn
router.delete('/:id', authRequired, roleRequired('ADMIN'), c.remove);

module.exports = router;
