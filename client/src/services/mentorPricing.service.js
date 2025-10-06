// src/services/mentorPricing.service.js
import api from '../lib/axios';

const MentorPricingService = {
  //  Lấy danh sách gói pricing (có thể truyền mentor_id nếu cần lọc)
  list: (mentor_id) => {
    const params = mentor_id ? { mentor_id } : {};
    return api.get('/pricing', { params });
  },

  // Lấy chi tiết 1 gói pricing theo id
  getOne: (id) => {
    return api.get(`/pricing/${id}`);
  },

  //  Tạo gói pricing mới (chỉ ADMIN hoặc MENTOR)
  create: (data) => {
    // data: { mentor_id, title, description, price, duration }
    return api.post('/pricing', data);
  },

  //  Cập nhật gói pricing (chỉ ADMIN hoặc mentor sở hữu)
  update: (id, data) => {
    return api.put(`/pricing/${id}`, data);
  },

  //  Xoá gói pricing (chỉ ADMIN hoặc mentor sở hữu)
  remove: (id) => {
    return api.delete(`/pricing/${id}`);
  },
};

export default MentorPricingService;
