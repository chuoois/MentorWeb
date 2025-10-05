// mentorChat.model.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const MESSAGE_TYPES = ['TEXT', 'IMAGE', 'FILE'];

const mentorChatSchema = new Schema(
  {
    order_id:     { type: Types.ObjectId, ref: 'MentorOrder', required: true, index: true },
    sender_id:    { type: Types.ObjectId, ref: 'User', required: true },
    receiver_id:  { type: Types.ObjectId, ref: 'User', required: true },
    message:      { type: String, required: true },           // nội dung text / link file
    message_type: { type: String, enum: MESSAGE_TYPES, default: 'TEXT' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false }, collection: 'mentor_chats' }
);

// Tối ưu load hội thoại theo order
mentorChatSchema.index({ order_id: 1, created_at: 1 });

module.exports = mongoose.model('MentorChat', mentorChatSchema);
