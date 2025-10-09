// src/services/booking.service.js
import api from "../lib/axios";

const BookingService = {
  createBooking: async (data) => {
    const response = await api.post("/api/bookings", data);
    return response.data;
  },

  getBookedSlots: async (mentorId) => {
    const response = await api.get(`/api/bookings/${mentorId}`);
    return response.data;
  },

  getMenteeBookings: async () => {
    const response = await api.get(`/api/bookings/mentee`);
    return response.data;
  },

  getBookingStatusByMenteeId: async (params = {}) => {
    const response = await api.get(`/api/bookings/mentee/status`, { params });
    return response.data;
  },

  getLearningProgress: async (params = {}) => {
    const response = await api.get(`/api/bookings/mentee/progress`, { params });
    return response.data;
  },

  recreatePaymentLink: async (bookingId) => {
    const response = await api.put(`/api/bookings/${bookingId}/recreate-payment`);
    return response.data;
  },

  getMentorApplications: async () => {
    const response = await api.get(`/api/bookings/applications`);
    return response.data;
  },

  getApplicationDetails: async (bookingId) => {
    const response = await api.get(`/api/bookings/applications/${bookingId}`);
    return response.data;
  },

  updateApplicationStatus: async (bookingId, data) => {
    const response = await api.patch(`/api/bookings/applications/${bookingId}/status`, data);
    return response.data;
  },

  updateSessionByMentor: async (bookingId, sessionIndex, data) => {
    const response = await api.patch(`/api/bookings/${bookingId}/session/${sessionIndex}`, data);
    return response.data;
  },
};

export default BookingService;