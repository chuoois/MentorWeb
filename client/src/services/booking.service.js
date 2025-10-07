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
};

export default BookingService;
