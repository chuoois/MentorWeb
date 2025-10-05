// mentorPricing.model.js
const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const mentorPricingSchema = new Schema(
  {
    mentor_id: { type: Types.ObjectId, ref: 'Mentor', required: true, index: true },
    title: { type: String, required: true, trim: true }, // ví dụ: '1h Coaching'
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },     // VND
    duration: { type: Number, min: 1 },                  // phút/giờ
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false }, collection: 'mentor_pricing' }
);

// (tuỳ chọn) Một mentor không nên có 2 gói trùng title
mentorPricingSchema.index({ mentor_id: 1, title: 1 }, { unique: true });

module.exports = mongoose.model('MentorPricing', mentorPricingSchema);
