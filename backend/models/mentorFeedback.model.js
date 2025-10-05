// mentorFeedback.model.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const mentorFeedbackSchema = new Schema(
  {
    order_id:  { type: Types.ObjectId, ref: 'MentorOrder', required: true, index: true },
    mentor_id: { type: Types.ObjectId, ref: 'Mentor', required: true, index: true },
    mentee_id: { type: Types.ObjectId, ref: 'Mentee', required: true, index: true },
    rating:    { type: Number, min: 1, max: 5, required: true },
    comment:   { type: String, default: '' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false }, collection: 'mentor_feedback' }
);

// Mỗi order chỉ để lại 1 feedback bởi mentee
mentorFeedbackSchema.index({ order_id: 1, mentee_id: 1 }, { unique: true });

module.exports = mongoose.model('MentorFeedback', mentorFeedbackSchema);
