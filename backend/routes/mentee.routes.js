// routes/mentees.routes.js
const express = require('express');
const router = express.Router();
const ctl = require('../controller/mentee.controller');

router.post('/', ctl.create);
router.get('/', ctl.list);
router.get('/:id', ctl.getById);
router.get('/by-user/:userId', ctl.getByUserId);
router.patch('/:id', ctl.update);
router.delete('/:id', ctl.remove);

module.exports = router;
