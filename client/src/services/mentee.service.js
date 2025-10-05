import api from "@/lib/axios";

/**
 * MenteeService: Cung cấp các hàm CRUD cho thực thể Mentee.
 * Tất cả request đều hướng tới /mentees/... tương ứng với backend.
 */
const MenteeService = {
  /**
   * Tạo mới một mentee
   * @param {Object} data - { user_id: string }
   * @returns {Promise<Object>} - { ok, data } hoặc lỗi từ backend
   */
  create: async (data) => {
    const res = await api.post("/mentees", data);
    return res.data;
  },

  /**
   * Lấy danh sách mentees (có hỗ trợ search và phân trang)
   * @param {Object} params - { search?: string, page?: number, pageSize?: number }
   * @returns {Promise<Object>} - { ok, data, pagination }
   */
  list: async (params = {}) => {
    const res = await api.get("/mentees", { params });
    return res.data;
  },

  /**
   * Lấy thông tin mentee theo id
   * @param {string} id
   * @returns {Promise<Object>} - { ok, data }
   */
  getById: async (id) => {
    const res = await api.get(`/mentees/${id}`);
    return res.data;
  },

  /**
   * Lấy mentee theo user_id (dùng khi cần tìm mentee gắn với user cụ thể)
   * @param {string} userId
   * @returns {Promise<Object>} - { ok, data }
   */
  getByUserId: async (userId) => {
    const res = await api.get(`/mentees/by-user/${userId}`);
    return res.data;
  },

  /**
   * Cập nhật thông tin mentee (chủ yếu để đổi user_id)
   * @param {string} id
   * @param {Object} data - { user_id?: string }
   * @returns {Promise<Object>} - { ok, data }
   */
  update: async (id, data) => {
    const res = await api.patch(`/mentees/${id}`, data);
    return res.data;
  },

  /**
   * Xoá mentee theo id
   * @param {string} id
   * @returns {Promise<Object>} - { ok, data: { deleted_id } }
   */
  remove: async (id) => {
    const res = await api.delete(`/mentees/${id}`);
    return res.data;
  },
};

export default MenteeService;
