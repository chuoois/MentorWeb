const express = require('express');
const router = express.Router();
const paymentsController = require('../controller/payment.controller');

// ⚠️ Phải dùng express.raw() cho webhook PayOS
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentsController.webhook
);

// Các route khác (nếu có)
router.get('/:orderCode', paymentsController.getPaymentInfo);
router.post('/booking/:id', paymentsController.createLinkForBooking);

module.exports = router;
