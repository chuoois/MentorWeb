import api from "../lib/axios";

const MentorService = {
    register: async (data) => {
        const response = await api.post("/api/mentors/register", data);
        return response.data;
    },
    login: async (data) => {
        const response = await api.post("/api/mentors/login", data);
        return response.data;
    },
    listActiveMentors: async (params = {}) => {
        const response = await api.get("/api/mentors", { params });
        return response.data;
    },
    get8MentorsNew: async () => {
        const response = await api.get("/api/mentors/new");
        return response.data;
    },
    get8MentorsRating: async () => {
        const response = await api.get("/api/mentors/rating");
        return response.data;
    },
    getMentorByID: async (id) => {
        const response = await api.get(`/api/mentors/${id}`);
        return response.data;
    },
};

export default MentorService;