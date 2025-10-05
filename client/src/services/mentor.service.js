import api from "@/lib/axios";

/**
 * MentorService: Cung cấp các hàm thao tác với mentor
 * Bao gồm lấy danh sách, xem chi tiết, tạo mới, cập nhật, apply trở thành mentor,...
 * Toàn bộ request hướng tới /mentors/... tương ứng với backend.
 */
const MentorService = {
  /**
   * Lấy danh sách mentor
   * @param {Object} params - { search?: string, page?: number, pageSize?: number, category?: string }
   * @returns {Promise<Object>} - { total, items }
   */
  list: async (params = {}) => {
    const res = await api.get("/mentors", { params });
    return res.data;
  },

  /**
   * Lấy chi tiết 1 mentor theo id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  getOne: async (id) => {
    const res = await api.get(`/mentors/${id}`);
    return res.data;
  },

  /**
   * Tạo mới mentor profile
   * - ADMIN có thể tạo cho user khác
   * - MENTOR chỉ có thể tạo cho chính mình
   * @param {Object} data - {
   *   user_id, job_title, company, category, skill, bio,
   *   current_position, linkedin_url, personal_link_url,
   *   intro_video, featured_article, question, cv_img
   * }
   */
  create: async (data) => {
    const res = await api.post("/mentors", data);
    return res.data;
  },

  /**
   * Mentee gửi yêu cầu apply trở thành mentor
   * (sẽ set role = 'MENTOR' và status = 'PENDING' cho admin duyệt)
   */
  apply: async () => {
    const res = await api.post("/mentors/apply");
    return res.data;
  },

  /**
   * Cập nhật mentor bằng PUT (admin hoặc chính chủ)
   * @param {string} id
   * @param {Object} data - thông tin mentor cần cập nhật
   */
  updatePut: async (id, data) => {
    const res = await api.put(`/mentors/${id}`, data);
    return res.data;
  },

  /**
   * Cập nhật mentor bằng PATCH (admin hoặc chính chủ)
   * @param {string} id
   * @param {Object} data - chỉ các trường thay đổi
   */
  updatePatch: async (id, data) => {
    const res = await api.patch(`/mentors/${id}`, data);
    return res.data;
  },

  /**
   * Xóa mentor (chỉ ADMIN)
   * @param {string} id
   */
  remove: async (id) => {
    const res = await api.delete(`/mentors/${id}`);
    return res.data;
  },
};

export default MentorService;
