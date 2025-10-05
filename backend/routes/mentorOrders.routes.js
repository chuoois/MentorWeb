// backend/routes/mentorOrders.routes.js
const router = require('express').Router();
const c = require('../controller/mentorOrder.controller.js');
const { authRequired, roleRequired } = require('../middleware/auth.middleware.js');

// ADMIN có thể xem tất cả, Mentee chỉ xem order của mình, Mentor xem order liên quan
router.get('/', authRequired, c.list);
router.get('/:id', authRequired, c.getOne);

// Mentee tạo order mới
router.post('/', authRequired, roleRequired('MENTEE'), c.create);

// Cập nhật trạng thái (mentor xác nhận / admin chỉnh sửa)
router.put('/:id', authRequired, roleRequired('ADMIN', 'MENTOR'), c.update);
router.patch('/:id', authRequired, roleRequired('ADMIN', 'MENTOR'), c.update);


// ADMIN mới được xoá order
router.delete('/:id', authRequired, roleRequired('ADMIN'), c.remove);

module.exports = router;
