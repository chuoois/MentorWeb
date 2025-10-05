const MentorOrder = require('../models/mentorOrder.model');
const Mentor = require('../models/mentor.model');
const Mentee = require('../models/mentee.model');
const MentorPricing = require('../models/mentorPricing.model');
const mongoose = require('mongoose');

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

//  CREATE - mentee đặt order
// body: { mentor_id, mentee_id, pricing_id, scheduled_at }
exports.create = async (req, res) => {
  try {
    const { mentor_id, mentee_id, pricing_id, scheduled_at } = req.body;

    if (!mentor_id || !mentee_id || !pricing_id) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    if (![mentor_id, mentee_id, pricing_id].every(isObjectId)) {
      return res.status(400).json({ ok: false, error: 'Invalid ID format' });
    }

    // kiểm tra tồn tại
    const mentor = await Mentor.findById(mentor_id);
    if (!mentor) return res.status(404).json({ ok: false, error: 'Mentor not found' });

    const mentee = await Mentee.findById(mentee_id);
    if (!mentee) return res.status(404).json({ ok: false, error: 'Mentee not found' });

    const pricing = await MentorPricing.findById(pricing_id);
    if (!pricing) return res.status(404).json({ ok: false, error: 'Pricing not found' });

    const order = await MentorOrder.create({
      mentor_id,
      mentee_id,
      pricing_id,
      status: 'PENDING',
      scheduled_at: scheduled_at || null
    });

    return res.status(201).json({ ok: true, data: order });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

//  READ ALL (admin xem tất cả, còn lại lọc theo user)
exports.list = async (req, res) => {
  try {
    const query = {};
    if (req.user?.role === 'MENTOR') {
      query.mentor_id = req.user._id;
    } else if (req.user?.role === 'MENTEE') {
      query.mentee_id = req.user._id;
    }
    const orders = await MentorOrder.find(query)
      .populate('mentor_id', 'job_title company')
      .populate('mentee_id', 'user_id')
      .populate('pricing_id', 'title price duration')
      .sort({ created_at: -1 });

    return res.json({ ok: true, data: orders });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

//  READ ONE
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const order = await MentorOrder.findById(id)
      .populate('mentor_id', 'job_title company')
      .populate('mentee_id', 'user_id')
      .populate('pricing_id', 'title price duration');

    if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });

    // Quyền xem: Admin hoặc chính mentor/mentee của order
    if (req.user?.role !== 'ADMIN' &&
        ![order.mentor_id?._id?.toString(), order.mentee_id?._id?.toString()].includes(req.user?._id?.toString())) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    return res.json({ ok: true, data: order });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

// UPDATE (status, scheduled_at)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const { status, scheduled_at } = req.body;

    const order = await MentorOrder.findById(id);
    if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });

    // Chỉ admin hoặc mentor của order được update
    if (req.user?.role !== 'ADMIN' && req.user?._id?.toString() !== order.mentor_id.toString()) {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    if (status) order.status = status;
    if (scheduled_at) order.scheduled_at = scheduled_at;

    await order.save();
    return res.json({ ok: true, data: order });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};

//  DELETE
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const order = await MentorOrder.findById(id);
    if (!order) return res.status(404).json({ ok: false, error: 'Order not found' });

    // chỉ admin mới xoá
    if (req.user?.role !== 'ADMIN') {
      return res.status(403).json({ ok: false, error: 'Forbidden' });
    }

    await order.deleteOne();
    return res.json({ ok: true, message: 'Deleted' });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
};
