// backend/routes/mentorFeedback.routes.js
const router = require('express').Router();
const c = require('../controller/mentorFeedback.controller.js');
const { authRequired, roleRequired } = require('../middleware/auth.middleware.js');

// Public xem feedback theo mentor
router.get('/mentor/:mentorId', c.listByMentor);
router.get('/:id', c.getOne);

// Mentee tạo feedback sau khi hoàn tất order
router.post('/', authRequired, roleRequired('MENTEE'), c.create);

// Chỉ admin được xoá feedback
router.delete('/:id', authRequired, roleRequired('ADMIN'), c.remove);

module.exports = router;
