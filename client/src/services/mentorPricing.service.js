// src/services/mentorPricing.service.js
import api from './api'; // axios instance đã cấu hình sẵn baseURL + token interceptor

const MentorPricingService = {
  //  Lấy danh sách gói pricing (có thể truyền mentor_id nếu cần lọc)
  list: (mentor_id) => {
    const params = mentor_id ? { mentor_id } : {};
    return api.get('/mentor-pricing', { params });
  },

  // Lấy chi tiết 1 gói pricing theo id
  getOne: (id) => {
    return api.get(`/mentor-pricing/${id}`);
  },

  //  Tạo gói pricing mới (chỉ ADMIN hoặc MENTOR)
  create: (data) => {
    // data: { mentor_id, title, description, price, duration }
    return api.post('/mentor-pricing', data);
  },

  //  Cập nhật gói pricing (chỉ ADMIN hoặc mentor sở hữu)
  update: (id, data) => {
    return api.put(`/mentor-pricing/${id}`, data);
  },

  //  Xoá gói pricing (chỉ ADMIN hoặc mentor sở hữu)
  remove: (id) => {
    return api.delete(`/mentor-pricing/${id}`);
  },
};

export default MentorPricingService;
