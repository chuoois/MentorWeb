const MentorFeedback = require('../models/mentorFeedback.model');
const MentorOrder = require('../models/mentorOrder.model');
const mongoose = require('mongoose');

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// CREATE feedback
// body: { order_id, mentor_id, mentee_id, rating, comment }
exports.create = async (req, res) => {
  try {
    const { order_id, mentor_id, mentee_id, rating, comment } = req.body;

    if (!order_id || !mentor_id || !mentee_id || !rating) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
    if (![order_id, mentor_id, mentee_id].every(isObjectId)) {
      return res.status(400).json({ ok: false, error: 'Invalid ID format' });
    }

    // phải tồn tại order và mentee phải thuộc order đó
    const order = await MentorOrder.findById(order_id);
    if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });
    if (order.mentee_id.toString() !== mentee_id) {
      return res.status(403).json({ ok: false, error: 'This mentee not in order' });
    }
    if (order.mentor_id.toString() !== mentor_id) {
      return res.status(403).json({ ok: false, error: 'This mentor not in order' });
    }

    // kiểm tra trạng thái order phải completed mới được feedback
    if (order.status !== 'COMPLETED') {
      return res.status(400).json({ ok: false, error: 'Order not completed yet' });
    }

    // tránh mentee feedback nhiều lần cho 1 order
    const existed = await MentorFeedback.findOne({ order_id, mentee_id });
    if (existed) {
      return res.status(409).json({ ok: false, error: 'Feedback already exists' });
    }

    const fb = await MentorFeedback.create({
      order_id,
      mentor_id,
      mentee_id,
      rating,
      comment: comment || ''
    });

    return res.status(201).json({ ok: true, data: fb });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

// LIST feedback của 1 mentor
exports.listByMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    if (!isObjectId(mentorId)) return res.status(400).json({ ok: false, error: 'Invalid mentorId' });

    const feedbacks = await MentorFeedback.find({ mentor_id: mentorId })
      .populate('mentee_id', 'full_name avatar_url')
      .sort({ created_at: -1 });

    return res.json({ ok: true, data: feedbacks });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

//  GET ONE feedback
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const fb = await MentorFeedback.findById(id)
      .populate('mentee_id', 'full_name avatar_url')
      .populate('mentor_id', 'job_title company');

    if (!fb) return res.status(404).json({ ok: false, error: 'Feedback not found' });

    return res.json({ ok: true, data: fb });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

//  UPDATE feedback (chỉ mentee hoặc admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const fb = await MentorFeedback.findById(id);
    if (!fb) return res.status(404).json({ ok: false, error: 'Feedback not found' });

    if (req.user?.role !== 'ADMIN' && fb.mentee_id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    if (rating) fb.rating = rating;
    if (comment) fb.comment = comment;

    await fb.save();
    return res.json({ ok: true, data: fb });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

//  DELETE feedback (admin hoặc mentee chủ feedback)
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const fb = await MentorFeedback.findById(id);
    if (!fb) return res.status(404).json({ ok: false, error: 'Feedback not found' });

    if (req.user?.role !== 'ADMIN' && fb.mentee_id.toString() !== req.user?._id.toString()) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    await fb.deleteOne();
    return res.json({ ok: true, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
