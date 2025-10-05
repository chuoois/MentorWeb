// backend/routes/mentorPricing.routes.js
const router = require('express').Router();
const c = require('../controller/mentorPricing.controller.js');
const { authRequired, roleRequired } = require('../middleware/auth.middleware.js');

// Public: mentee hoặc khách có thể xem danh sách gói
router.get('/', c.list);
router.get('/:id', c.getOne);

// ADMIN hoặc MENTOR tạo gói pricing
router.post('/', authRequired, roleRequired('ADMIN', 'MENTOR'), c.create);

// ADMIN hoặc mentor sở hữu gói đó mới được update
router.put('/:id', authRequired, roleRequired('ADMIN', 'MENTOR'), c.updatePut);
router.patch('/:id', authRequired, roleRequired('ADMIN', 'MENTOR'), c.updatePatch);

// ADMIN hoặc mentor sở hữu gói đó mới được xoá
router.delete('/:id', authRequired, roleRequired('ADMIN', 'MENTOR'), c.remove);

module.exports = router;
