import api from "@/lib/axios";

// ===============================
// USERS MANAGEMENT
// ===============================
export const adminService = {
  // Lấy danh sách người dùng (có phân trang + tìm kiếm)
  getAllUsers: (params) => api.get("/admin/users", { params }),

  // Cập nhật vai trò (role)
  updateUserRole: (id, role) =>
    api.patch(`/admin/users/${id}/role`, { role }),

  // Cập nhật trạng thái (status)
  updateUserStatus: (id, status) =>
    api.patch(`/admin/users/${id}/status`, { status }),

  // Toggle trạng thái xác minh email
  toggleEmailVerified: (id) =>
    api.patch(`/admin/users/${id}/verify`),

  // ===============================
  // MENTOR MODERATION
  // ===============================
  getPendingMentors: () => api.get("/admin/mentors/pending"),

  approveMentor: (id) => api.patch(`/admin/mentors/${id}/approve`),

  rejectMentor: (id) => api.patch(`/admin/mentors/${id}/reject`),

  // ===============================
  // PRICING MANAGEMENT
  // ===============================
  getAllPricing: () => api.get("/admin/pricing"),

  deletePricing: (id) => api.delete(`/admin/pricing/${id}`),

  // ===============================
  // ORDER MANAGEMENT
  // ===============================
  getAllOrders: () => api.get("/admin/orders"),

  updateOrderStatus: (id, status) =>
    api.patch(`/admin/orders/${id}/status`, { status }),

  // ===============================
  // FEEDBACK MANAGEMENT
  // ===============================
  getAllFeedback: () => api.get("/admin/feedback"),

  deleteFeedback: (id) => api.delete(`/admin/feedback/${id}`),
};

export default adminService;
