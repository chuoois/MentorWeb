const router = require('express').Router();
const c = require('../controller/users.controller.js');
const { authRequired, roleRequired } = require('../middleware/auth.middleware.js');

router.get('/', authRequired, roleRequired('ADMIN'), c.list);
router.get('/:id', authRequired, c.getOne);
router.post('/', authRequired, roleRequired('ADMIN'), c.create);
router.put('/:id', authRequired, c.updatePut);
router.patch('/:id', authRequired, c.updatePatch);
router.delete('/:id', authRequired, roleRequired('ADMIN'), c.remove);

module.exports = router; // <-- export CHÍNH XÁC là router
