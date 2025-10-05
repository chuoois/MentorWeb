// src/services/user.service.js
import api from './api'; // axios instance có sẵn baseURL + token interceptor

const UserService = {
  /**
   * Lấy danh sách người dùng (chỉ ADMIN)
   * @param {Object} params - Các filter như { search, page, pageSize, role, status }
   */
  list: (params = {}) => {
    return api.get('/users', { params });
  },

  /**
   * Lấy chi tiết 1 người dùng
   * - ADMIN có thể xem mọi user
   * - User thường chỉ xem chính mình
   */
  getOne: (id) => {
    return api.get(`/users/${id}`);
  },

  /**
   * Tạo user mới (chỉ ADMIN)
   * @param {Object} data - { email, password, full_name, phone, role, status, avatar_url }
   */
  create: (data) => {
    return api.post('/users', data);
  },

  /**
   *  Cập nhật user (PUT - full update)
   * - ADMIN có thể chỉnh tất cả
   * - User thường chỉ sửa thông tin cá nhân
   */
  updatePut: (id, data) => {
    return api.put(`/users/${id}`, data);
  },

  /**
   * Cập nhật user (PATCH - partial update)
   * - ADMIN hoặc chính chủ user
   */
  updatePatch: (id, data) => {
    return api.patch(`/users/${id}`, data);
  },

  /**
   * Xoá user (chỉ ADMIN)
   */
  remove: (id) => {
    return api.delete(`/users/${id}`);
  },
};

export default UserService;
