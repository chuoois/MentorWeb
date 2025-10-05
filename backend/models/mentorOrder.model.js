// mentorOrder.model.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const ORDER_STATUS = ['PENDING', 'PAID', 'COMPLETED', 'CANCELED'];

const mentorOrderSchema = new Schema(
  {
    mentor_id:   { type: Types.ObjectId, ref: 'Mentor', required: true, index: true },
    mentee_id:   { type: Types.ObjectId, ref: 'Mentee', required: true, index: true },
    pricing_id:  { type: Types.ObjectId, ref: 'MentorPricing', required: true, index: true },
    status:      { type: String, enum: ORDER_STATUS, default: 'PENDING', index: true },
    scheduled_at:{ type: Date }, // thời gian hẹn
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, collection: 'mentor_orders' }
);

// Tối ưu truy vấn lịch sử order 1 mentee với 1 mentor
mentorOrderSchema.index({ mentee_id: 1, mentor_id: 1, created_at: -1 });

module.exports = mongoose.model('MentorOrder', mentorOrderSchema);
