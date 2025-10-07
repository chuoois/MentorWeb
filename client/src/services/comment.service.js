import api from "../lib/axios";

const CommentService = {
    getCommentsByMentor: async (mentorId, params = {}) => {
        // params có thể là { page, limit }
        const response = await api.get(`/api/comments/mentor/${mentorId}`, { params });
        return response.data;
    },
    createComment: async (data) => {
        const response = await api.post("/api/comments", data);
        return response.data;
    },
    updateComment: async (commentId, data) => {
        const response = await api.put(`/api/comments/${commentId}`, data);
        return response.data;
    },
    deleteComment: async (commentId) => {
        const response = await api.delete(`/api/comments/${commentId}`);
        return response.data;
    },
};

export default CommentService;
