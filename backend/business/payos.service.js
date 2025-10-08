// business/payos.service.js
const { PayOS } = require('@payos/node');
const crypto = require('crypto');
const Booking = require('../models/booking.model');

const payos = new PayOS({
  clientId: process.env.PAYOS_CLIENT_ID,
  apiKey: process.env.PAYOS_API_KEY,
  checksumKey: process.env.PAYOS_CHECKSUM_KEY,
});

exports.handleWebhook = async (rawBody) => {
  try {
    // 1) Verify bằng SDK
    const verified = await payos.webhooks.verify(rawBody);
    const data = verified?.data;
    if (!data) return { ok: false, note: 'no data', _debug: { data } };
    return await processData(data);
  } catch (err) {
    // 2) Fallback: tự verify để biết lệch gì
    const data = rawBody?.data;
    const gotSig = rawBody?.signature || rawBody?.sig;
    if (!data || !gotSig) {
      return { ok: false, note: 'missing data/signature', _debug: { data, gotSig } };
    }
    const calcSig = crypto
      .createHmac('sha256', process.env.PAYOS_CHECKSUM_KEY)
      .update(JSON.stringify(data))
      .digest('hex');

    if (calcSig !== gotSig) {
      return { ok: false, note: 'signature mismatch', _debug: { mismatch: true, calcSig, gotSig, data } };
    }
    return await processData(data);
  }
};

async function processData(data) {
  const orderCode = Number(data.orderCode ?? data.order_code);
  const amount    = Number(data.amount);
  const code      = String(data.code ?? '').trim();
  const status    = String(data.status ?? '').trim().toUpperCase();

  // 3) Điều kiện “đã thanh toán”
  const paidSuccess = code === '00' || status === 'PAID' || data?.success === true;

  // 4) Nếu không paid, đánh FAILED (trừ khi đã PAID trước đó)
  if (!paidSuccess) {
    await Booking.updateOne(
      { order_code: orderCode, paymentStatus: { $ne: 'PAID' } },
      { $set: { paymentStatus: 'FAILED' } }
    );
    return { ok: true, paid: false, note: status || code || 'UNKNOWN', _debug: { data } };
  }

  // 5) Cập nhật ATOMIC (và chỉ khi số tiền khớp)
  const updated = await Booking.findOneAndUpdate(
    { order_code: orderCode, price: amount }, // khớp amount để tránh nhầm đơn
    {
      $set: {
        paymentStatus: 'PAID',
        status: 'CONFIRMED',
        payment_link_id: data.paymentLinkId || undefined
      }
    },
    { new: true } // trả về doc sau update
  ).lean();

  if (!updated) {
    // Không tìm thấy doc thỏa điều kiện -> khả năng lệch amount hoặc orderCode
    const probe = await Booking.findOne({ order_code: orderCode }, { price: 1, paymentStatus: 1, status: 1 }).lean();
    return {
      ok: false,
      note: 'not updated (orderCode or amount mismatch)',
      _debug: { data, db: probe }
    };
  }

  return { ok: true, paid: true, _debug: { data } };
  
}

// dùng update atomic để chắc chắn
async function updatePaid(orderCode, amount, paymentLinkId) {
  return Booking.findOneAndUpdate(
    { order_code: Number(orderCode), price: Number(amount) },
    { $set: { paymentStatus: 'PAID', status: 'CONFIRMED', payment_link_id: paymentLinkId || undefined } },
    { new: true }
  ).lean();
}

exports.handleWebhookNoVerify = async (rawBody) => {
  const data = rawBody?.data;
  if (!data) return { ok: false, note: 'no data', _debug: { data } };

  const orderCode = Number(data.orderCode ?? data.order_code);
  const amount    = Number(data.amount);
  const status    = String(data.status ?? '').toUpperCase();
  const code      = String(data.code ?? '').trim();

  // coi là thanh toán ok nếu PAID hoặc code '00'
  const paidSuccess = status === 'PAID' || code === '00' || rawBody?.success === true;

  if (!paidSuccess) {
    await Booking.updateOne(
      { order_code: orderCode, paymentStatus: { $ne: 'PAID' } },
      { $set: { paymentStatus: 'FAILED' } }
    );
    return { ok: true, paid: false, note: status || code || 'UNKNOWN', _debug: { data } };
  }

  const updated = await updatePaid(orderCode, amount, data.paymentLinkId);
  if (!updated) {
    const probe = await Booking.findOne({ order_code: orderCode }, { price:1, paymentStatus:1, status:1 }).lean();
    return { ok: false, note: 'not updated (orderCode or amount mismatch)', _debug: { data, db: probe } };
  }

  return { ok: true, paid: true, _debug: { data } };
};
