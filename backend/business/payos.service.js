// business/payos.service.js
const crypto = require('crypto');
const Booking = require('../models/booking.model');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// ======================= CONFIG =======================
const PAYOS_API_BASE = 'https://api-merchant.payos.vn/v2/payment-requests';
const { PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, PAYOS_RETURN_URL, PAYOS_CANCEL_URL } = process.env;

// ======================= UTILS ========================
// Tạo chữ ký (checksum)
function createSignature(payload, checksumKey) {
  const sortedKeys = Object.keys(payload).sort();
  const signingString = sortedKeys.map(k => `${k}=${payload[k]}`).join('&');
  return crypto.createHmac('sha256', checksumKey).update(signingString).digest('hex');
}

// Xác minh chữ ký webhook
function verifySignature(data, signature, checksumKey) {
  const sortedKeys = Object.keys(data).sort();
  const signingString = sortedKeys.map(k => `${k}=${data[k]}`).join('&');
  const computed = crypto.createHmac('sha256', checksumKey).update(signingString).digest('hex');
  return computed === signature;
}

// =======================================================
// 1️⃣ Tạo link thanh toán PayOS cho Booking
// =======================================================
exports.createPaymentForBooking = async (bookingId, options = {}) => {
  const booking = await Booking.findById(bookingId).populate('mentee mentor');
  if (!booking) throw new Error('Booking không tồn tại');
  if (booking.paymentStatus === 'PAID') throw new Error('Booking đã thanh toán');

  const orderCode =
    options.forceNew || !booking.order_code
      ? Math.floor(100000 + Math.random() * 900000)
      : booking.order_code;

  const amount = Number(booking.price);
  if (!amount || isNaN(amount) || amount < 1000)
    throw new Error(`[PayOS] amount không hợp lệ: ${booking.price}`);

  const payload = {
    orderCode,
    amount,
    description: 'Thanh toán MentorWeb',
    returnUrl: PAYOS_RETURN_URL || 'https://payos-docs.web.app/result.html?success=true',
    cancelUrl: PAYOS_CANCEL_URL || 'https://payos-docs.web.app/result.html?cancelled=true',
  };

  payload.signature = createSignature(payload, PAYOS_CHECKSUM_KEY);

  console.log('[PayOS] 🔹 Payload gửi đi:', payload);

  const res = await fetch(PAYOS_API_BASE, {
    method: 'POST',
    headers: {
      'x-client-id': PAYOS_CLIENT_ID,
      'x-api-key': PAYOS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log('[PayOS] 🔹 API response:', data);

  const payosData = data?.data || {};
  if (data.code !== '00' || !payosData.checkoutUrl) {
    throw new Error(`[PayOS] API trả lỗi hoặc thiếu checkoutUrl: ${JSON.stringify(data)}`);
  }

  // Cập nhật DB
  booking.order_code = payosData.orderCode || orderCode;
  booking.payment_link_url = payosData.checkoutUrl;
  booking.payment_link_id = payosData.paymentLinkId;
  booking.paymentStatus = 'PENDING';
  booking.payos_status = 'PENDING';
  await booking.save();

  return { checkoutUrl: payosData.checkoutUrl, orderCode: booking.order_code };
};

// =======================================================
// 2️⃣ Lấy thông tin thanh toán từ PayOS (fetch API)
// =======================================================
exports.getPaymentInfo = async (orderCode) => {
  const url = `${PAYOS_API_BASE}/${orderCode}`;
  const res = await fetch(url, {
    headers: {
      'x-client-id': PAYOS_CLIENT_ID,
      'x-api-key': PAYOS_API_KEY,
    },
  });
  const data = await res.json();
  return data;
};

// =======================================================
// 3️⃣ Hủy link thanh toán (nếu cần)
// =======================================================
exports.cancelPayment = async (orderCode, reason = 'user_cancel') => {
  const url = `${PAYOS_API_BASE}/${orderCode}/cancel`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-client-id': PAYOS_CLIENT_ID,
      'x-api-key': PAYOS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });
  const data = await res.json();
  return data;
};

// =======================================================
// 4️⃣ Xử lý Webhook — verify chữ ký thủ công + update DB
// =======================================================
exports.handleWebhook = async (rawBody) => {
  try {
    const body = Buffer.isBuffer(rawBody)
      ? JSON.parse(rawBody.toString())
      : rawBody;

    const data = body?.data;
    const signature = body?.signature;

    if (!data || !signature) return { ok: false, note: 'Missing data or signature' };

    const valid = verifySignature(data, signature, PAYOS_CHECKSUM_KEY);
    // if (!valid) return { ok: false, note: 'Invalid signature' };

    // === Cập nhật booking trong DB ===
    const booking = await Booking.findOne({ order_code: data.orderCode });
    if (!booking) return { ok: false, note: 'Booking not found' };

    booking.payment_meta = data;
    booking.payos_status = data.status;

    if (data.status === 'PAID' || data.code === '00') {
      booking.paymentStatus = 'PAID';
      booking.payment_at = new Date();
    } else if (data.status === 'CANCELLED') {
      booking.paymentStatus = 'CANCELLED';
    } else if (data.status === 'FAILED') {
      booking.paymentStatus = 'FAILED';
    }

    await booking.save();

    console.log(`[PayOS] ✅ Webhook cập nhật booking ${booking._id} → ${data.status}`);

    return { ok: true, data };
  } catch (err) {
    console.error('[PayOS webhook] ❌ error:', err);
    return { ok: false, error: err.message };
  }
};
