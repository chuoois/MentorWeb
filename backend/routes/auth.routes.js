// backend/routes/auth.routes.js
const router = require('express').Router();
const c = require('../controller/auth.controller.js');
router.post('/register', c.register);
router.get('/verify-email', c.verifyEmail);
router.post('/resend-verification', c.resendVerificationEmail);
router.post('/login', c.login);
router.post('/refresh', c.refresh);
router.post('/google', c.loginWithGoogle);
router.post('/forgot', c.forgotPassword);
module.exports = router;