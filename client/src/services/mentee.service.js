import api from "../lib/axios";

const MenteeService = {
  register: async (data) => {
    try {
      const res = await api.post("/api/mentees/register", data);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  login: async (data) => {
    try {
      const res = await api.post("/api/mentees/login", data);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  forgotPassword: async (data) => {
    try {
      const res = await api.post("/api/mentees/forgot-password", data);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  loginWithGoogle: async (idToken) => {
    try {
      const res = await api.post("/api/mentees/login-with-google", { idToken });
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getProfile: async () => {
    try {
      const res = await api.get("/api/mentees");
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put("/api/mentees/update", data);
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  deleteAccount: async () => {
    try {
      const res = await api.delete("/api/mentees/delete");
      return res.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },
};

export default MenteeService;