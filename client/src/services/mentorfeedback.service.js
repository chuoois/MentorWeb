import api from "@/lib/axios";

/**
 * MentorFeedbackService: Cung cấp các hàm thao tác với feedback của mentor
 * Toàn bộ request đều hướng tới /feedback/... tương ứng với backend.
 */
const MentorFeedbackService = {
  /**
   * Tạo feedback mới sau khi order hoàn tất (mentee)
   * @param {Object} data - { order_id, mentor_id, mentee_id, rating, comment? }
   * @returns {Promise<Object>} - { ok, data }
   */
  create: async (data) => {
    const res = await api.post("/feedback", data);
    return res.data;
  },

  /**
   * Lấy danh sách feedback của 1 mentor (public)
   * @param {string} mentorId - ID của mentor
   * @returns {Promise<Object>} - { ok, data: [ ... ] }
   */
  listByMentor: async (mentorId) => {
    const res = await api.get(`/feedback/mentor/${mentorId}`);
    return res.data;
  },

  /**
   * Lấy chi tiết một feedback theo ID
   * @param {string} id - ID của feedback
   * @returns {Promise<Object>} - { ok, data }
   */
  getOne: async (id) => {
    const res = await api.get(`/feedback/${id}`);
    return res.data;
  },

  /**
   * Cập nhật feedback (mentee chủ feedback hoặc admin)
   * @param {string} id - ID của feedback
   * @param {Object} data - { rating?, comment? }
   * @returns {Promise<Object>} - { ok, data }
   */
  update: async (id, data) => {
    const res = await api.patch(`/feedback/${id}`, data);
    return res.data;
  },

  /**
   * Xóa feedback (chỉ admin)
   * @param {string} id - ID của feedback
   * @returns {Promise<Object>} - { ok, message }
   */
  remove: async (id) => {
    const res = await api.delete(`/feedback/${id}`);
    return res.data;
  },
};

export default MentorFeedbackService;
