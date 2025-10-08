// routes/payments.routes.js
const router = require('express').Router();
const c = require('../controller/payment.controller');
// Tạo link thanh toán cho booking
router.post('/bookings/:id/link', c.createLinkForBooking);
// Xem thông tin (optional)
router.get('/orders/:orderCode', c.getPaymentInfo);
// Webhook nhận kết quả thanh toán (POST từ PayOS)
router.post('/webhook', c.webhook);
router.get('/webhook', (req, res) => res.status(200).json({ ok: true }));
router.get('/confirm', c.confirmByOrder);
module.exports = router;
