import api from "../lib/axios";

const CommentService = {
    addRating: async (mentorId, data) => {
        const response = await api.post(`/api/ratings/${mentorId}`, data);
        return response.data;
    },
};

export default CommentService;
