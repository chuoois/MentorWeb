import api from "../lib/axios";

const AdminService = {
  // ---------------------- AUTH ----------------------
  login: async (data) => {
    // data = { email, password }
    const res = await api.post("/api/admin/login", data);
    return res.data;
  },

  // ---------------------- MENTOR ----------------------
  getMentors: async (params) => {
    // params = { page, limit, search, status }
    const res = await api.get("/api/admin/mentors", { params });
    return res.data;
  },

  getMentorDetail: async (id) => {
    const res = await api.get(`/api/admin/mentors/${id}`);
    return res.data;
  },

  changeMentorStatus: async (id, payload) => {
    // payload = { status, review_note }
    const res = await api.put(`/api/admin/mentors/${id}/status`, payload);
    return res.data;
  },

  // ---------------------- MENTEE ----------------------
  getMentees: async (params) => {
    // params = { page, limit, search, status }
    const res = await api.get("/api/admin/mentees", { params });
    return res.data;
  },

  getMenteeDetail: async (id) => {
    const res = await api.get(`/api/admin/mentees/${id}`);
    return res.data;
  },

  // ---------------------- BOOKING ----------------------
  getMentorWeeklyRevenue: async (mentorId) => {
    const res = await api.get(`/api/admin/mentor/${mentorId}/stats`);
    return res.data;
  },

  markMentorWeeklyPaid: async (mentorId) => {
    const res = await api.put(`/api/admin/mentor/${mentorId}/mark-paid`);
    return res.data;
  },
};

export default AdminService;