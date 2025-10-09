const payosSvc = require('../business/payos.service');
const Booking = require('../models/booking.model');

// ============================================================
// Tạo link thanh toán PayOS cho 1 booking
// ============================================================
exports.createLinkForBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { checkoutUrl, orderCode } = await payosSvc.createPaymentForBooking(id);
    res.json({ ok: true, checkoutUrl, orderCode });
  } catch (err) {
    next({ status: 400, message: err.message || 'Create payment link failed' });
  }
};

// ============================================================
// Lấy thông tin thanh toán PayOS theo orderCode
// ============================================================
exports.getPaymentInfo = async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const data = await payosSvc.getPaymentInfo(orderCode);
    res.json({ ok: true, data });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

// ============================================================
// Webhook PayOS: update trạng thái booking
// ============================================================
exports.webhook = async (req, res) => {
  try {
    // 1️ Parse raw body (express.raw được set ở route)
    const payload = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString())
      : req.body;

    // 2️ Xác minh webhook
    const result = await payosSvc.handleWebhook(payload);
    if (!result?.ok) {
      console.warn('[PayOS] ❌ Webhook verify fail:', result?.note);
      return res.status(400).json(result);
    }

    const data = result.data;
    const orderCode = data?.orderCode;
    const status = data?.status; // "PAID" | "CANCELLED" | "FAILED" | ...
    if (!orderCode) return res.status(400).json({ ok: false, message: 'Missing orderCode' });

    // 3️ Tìm booking
    const booking = await Booking.findOne({ order_code: orderCode });
    if (!booking) {
      console.warn('[PayOS] ⚠️ Booking not found for orderCode:', orderCode);
      return res.status(404).json({ ok: false, message: 'Booking not found' });
    }

    // 4️ Update trạng thái bằng methods trong schema
    switch (status) {
      case 'PAID':
        booking.markPaid(data);
        break;
      case 'CANCELLED':
      case 'EXPIRED':
        booking.markCancelled(data);
        break;
      case 'FAILED':
        booking.paymentStatus = 'FAILED';
        booking.payos_status = 'FAILED';
        booking.payment_meta = data;
        break;
      default:
        console.log('[PayOS] Unknown status:', status);
        break;
    }

    await booking.save();

    console.log(`[PayOS]  Updated booking ${booking._id} → ${status}`);

    // 5️⃣ Trả OK cho PayOS (rất quan trọng)
    return res.status(200).send('OK');
  } catch (err) {
    console.error('[PayOS] Webhook error:', err);
    return res.status(500).json({ ok: false, message: err.message });
  }
};
