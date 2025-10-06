// backend/routes/mentors.routes.js
const router = require('express').Router();
const c = require('../controller/mentor.controller.js');
const { authRequired, roleRequired } = require('../middleware/auth.middleware.js');


router.get('/', c.list);
router.get('/:id', c.getOne);


router.post('/', authRequired, roleRequired('ADMIN', 'MENTOR'), c.create);

// POST /api/mentors/apply - mentee applies to become mentor (goes to admin for approval)
router.post('/apply', authRequired, roleRequired('MENTOR'), c.apply);


router.put('/:id', authRequired, roleRequired('ADMIN', 'MENTOR'), c.updatePut);
router.patch('/:id', authRequired, roleRequired('ADMIN', 'MENTOR'), c.updatePatch);


router.delete('/:id', authRequired, roleRequired('ADMIN'), c.remove);

module.exports = router;
