// controller/payments.controller.js
const payosSvc = require('../business/payos.service');

exports.createLinkForBooking = async (req, res, next) => {
  try {
    const { id } = req.params; // bookingId
    const { checkoutUrl, orderCode } = await payosSvc.createPaymentForBooking(id);
    res.json({ ok: true, checkoutUrl, orderCode });
  } catch (err) {
    next({ status: 400, message: err.message || 'Create payment link failed' });
  }
};

exports.getPaymentInfo = async (req, res, next) => {
  try {
    const { orderCode } = req.params;
    const data = await payosSvc.getPaymentInfo(orderCode);
    res.json({ ok: true, data });
  } catch (err) {
    next({ status: 400, message: err.message });
  }
};

// PayOS webhook (PHẢI mở public internet)
exports.webhook = async (req, res) => {
  try {
    // Nếu dùng express.raw() cho route này, req.body là Buffer
    const payload = Buffer.isBuffer(req.body)
      ? JSON.parse(req.body.toString('utf8'))
      : (typeof req.body === 'string' ? JSON.parse(req.body) : req.body);

    const bypass = req.query.skipVerify === '1' || req.query.verify === '0';

    const result = bypass
      ? await payosSvc.handleWebhookNoVerify(payload) 
      : await payosSvc.handleWebhook(payload);       

    console.log('WEBHOOK RESULT =>', {
      ok: result.ok, paid: result.paid, note: result.note,
      debug: result._debug && {
        orderCode: result._debug.data?.orderCode,
        amount: result._debug.data?.amount,
        status: result._debug.data?.status,
        code: result._debug.data?.code,
        db: result._debug.db
      }
    });

    return res.status(200).json({ received: true, ok: result.ok, paid: result.paid, note: result.note });
  } catch (e) {
    console.error('WEBHOOK ERROR =>', e?.response?.data || e);
    return res.status(200).json({ received: false });
  }
};


exports.confirmByOrder = async (req, res) => {
  try {
    const orderCode = Number(req.query.orderCode);
    const info = await payosSvc.getPaymentInfo(orderCode);
    const status = info?.data?.status || info?.status;
    const amount = Number(info?.data?.amount ?? info?.amount);

    const booking = await Booking.findOne({ order_code: orderCode });
    if (!booking) return res.json({ ok:false, note:'booking not found' });

    if (status === 'PAID' && amount === Number(booking.price)) {
      if (booking.paymentStatus !== 'PAID') {
        booking.paymentStatus = 'PAID';
        if (booking.status === 'PENDING') booking.status = 'CONFIRMED';
        await booking.save();
      }
      return res.json({ ok:true, paid:true });
    }
    return res.json({ ok:true, paid:false, status, amount });
  } catch (e) {
    console.error('confirmByOrder error:', e?.response?.data || e);
    return res.status(400).json({ ok:false, message: e.message });
  }
};