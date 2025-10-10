import api from "../lib/axios";

const OtherService = {
  /**
   * Gửi dữ liệu webhook giả định để test backend
   * @param {Object} payload - Dữ liệu webhook theo format yêu cầu
   * Ví dụ:
   * {
   *   "data": {
   *     "orderCode": 172185,
   *     "status": "PAID",
   *     "amount": 60000
   *   },
   *   "signature": "fake_signature_for_test"
   * }
   */
  sendWebhook: async (payload) => {
    try {
      const res = await api.post("/api/payments/webhook", payload, {
        headers: {
          "Content-Type": "application/json",
        },
        transformRequest: [(data) => JSON.stringify(data)], // đảm bảo giữ nguyên JSON thô
      });
      return res.data;
    } catch (err) {
      console.error("Webhook error:", err.response?.data || err.message);
      throw err;
    }
  },
};

export default OtherService;
