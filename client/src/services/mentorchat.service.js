import api from "@/lib/axios";

/**
 * MentorChatService: Cung cấp các hàm quản lý tin nhắn giữa mentor và mentee
 * Toàn bộ request đều hướng tới /mentorChats/... tương ứng với backend.
 */
const MentorChatService = {
  /**
   * Lấy toàn bộ tin nhắn của một order
   * @param {string} orderId - ID của order (MentorOrder)
   * @returns {Promise<Object>} - { ok, data: [...] }
   */
  getByOrder: async (orderId) => {
    const res = await api.get(`/mentorChats/order/${orderId}`);
    return res.data;
  },

  /**
   * Lấy chi tiết một tin nhắn
   * @param {string} id - ID của tin nhắn
   * @returns {Promise<Object>} - { ok, data }
   */
  getOne: async (id) => {
    const res = await api.get(`/mentorChats/${id}`);
    return res.data;
  },

  /**
   * Gửi tin nhắn mới
   * @param {Object} data - { order_id, sender_id, receiver_id, message, message_type? }
   * @returns {Promise<Object>} - { ok, data }
   */
  create: async (data) => {
    const res = await api.post("/mentorChats", data);
    return res.data;
  },

  /**
   * Cập nhật nội dung tin nhắn (người gửi hoặc admin)
   * @param {string} id - ID của tin nhắn
   * @param {Object} data - { message }
   * @returns {Promise<Object>} - { ok, data }
   */
  update: async (id, data) => {
    const res = await api.patch(`/mentorChats/${id}`, data);
    return res.data;
  },

  /**
   * Xóa tin nhắn (người gửi hoặc admin)
   * @param {string} id - ID của tin nhắn
   * @returns {Promise<Object>} - { ok, message }
   */
  remove: async (id) => {
    const res = await api.delete(`/mentorChats/${id}`);
    return res.data;
  },
};

export default MentorChatService;
