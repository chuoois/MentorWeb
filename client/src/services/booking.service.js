// src/services/booking.service.js
import api from "../lib/axios";

const BookingService = {
  // ======================= MENTEE =======================

  createBooking: async (data) => {
    const res = await api.post("/api/bookings", data);
    return res.data;
  },

  recreatePaymentLink: async (bookingId) => {
    const res = await api.post(`/api/bookings/${bookingId}/recreate-payment`);
    return res.data;
  },

  cancelBooking: async (bookingId) => {
    const res = await api.patch(`/api/bookings/${bookingId}/cancel`);
    return res.data;
  },

  getMenteeBookings: async () => {
    const res = await api.get("/api/bookings/mentee");
    return res.data;
  },

  getBookingStatusByMenteeId: async (params = {}) => {
    const res = await api.get("/api/bookings/mentee/status", { params });
    return res.data;
  },

  getLearningProgress: async (params = {}) => {
    const res = await api.get("/api/bookings/mentee/progress", { params });
    return res.data;
  },

  getTransactionHistory: async (params = {}) => {
    const res = await api.get("/api/bookings/mentee/transactions", { params });
    return res.data;
  },

  // ======================= MENTOR =======================

  getMentorApplications: async () => {
    const res = await api.get("/api/bookings/applications");
    return res.data;
  },

  updateApplicationStatus: async (data) => {
    const res = await api.patch("/api/bookings/applications/action/status", data);
    return res.data;
  },

  updateSessionByMentor: async (applicationId, data) => {
    const res = await api.patch(`/api/bookings/applications/${applicationId}/session`, data);
    return res.data;
  },

  getApplicationDetails: async (applicationId) => {
    const res = await api.get(`/api/bookings/applications/${applicationId}`);
    return res.data;
  },

  getMentorBookedSlots: async () => {
    const res = await api.get("/api/bookings/mentor/applications");
    return res.data;
  },

  getTeachProgress: async () => {
    const res = await api.get("/api/bookings/mentor/learning/progress");
    return res.data;
  },

  // ======================= PUBLIC =======================

  getBookedSlots: async (mentorId) => {
    const res = await api.get(`/api/bookings/mentor/${mentorId}/booked-slots`);
    return res.data;
  },

  confirmSession: async (bookingId, sessionIndex) => {
    const res = await api.patch(`/api/bookings/${bookingId}/sessions/${sessionIndex}/confirm`, { role: "mentee" });
    return res.data;
  },

  cancelSession: async (bookingId, sessionIndex, reason) => {
    const res = await api.patch(`/api/bookings/${bookingId}/sessions/${sessionIndex}/cancel`, { reason });
    return res.data;
  },
};

export default BookingService;