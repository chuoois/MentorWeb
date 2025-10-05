// src/services/mentorOrder.service.js
import api from "@/lib/axios";

/**
 * MentorOrderService:
 * Cung cấp các hàm thao tác với API /orders
 * Bao gồm: tạo order, xem danh sách, xem chi tiết, cập nhật và xoá order
 */
const MentorOrderService = {
  /**
   * Lấy danh sách order
   * - Admin: xem tất cả
   * - Mentor/Mentee: xem order liên quan đến mình
   */
  list: async () => {
    const res = await api.get("/orders");
    return res.data; // { ok, data }
  },

  /**
   * Lấy chi tiết 1 order
   * @param {string} id - ID của order
   */
  getOne: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  /**
   * Tạo order mới (MENTEE)
   * @param {Object} data - { mentor_id, mentee_id, pricing_id, scheduled_at? }
   */
  create: async (data) => {
    const res = await api.post("/orders", data);
    return res.data;
  },

  /**
   * Cập nhật order (ADMIN hoặc MENTOR)
   * - Dùng để xác nhận, thay đổi trạng thái hoặc lịch hẹn
   * @param {string} id - ID của order
   * @param {Object} data - { status?, scheduled_at? }
   */
  update: async (id, data) => {
    const res = await api.patch(`/orders/${id}`, data);
    return res.data;
  },

  /**
   * Xoá order (ADMIN)
   * @param {string} id - ID của order
   */
  remove: async (id) => {
    const res = await api.delete(`/orders/${id}`);
    return res.data;
  },
};

export default MentorOrderService;
