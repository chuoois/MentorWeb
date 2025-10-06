// mentorPricing.controller.js
const MentorPricing = require('../models/mentorPricing.model');
const Mentor = require('../models/mentor.model');
const mongoose = require('mongoose');

function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST /mentor-pricing
// body: { mentor_id, title, description, price, duration }
exports.create = async (req, res) => {
  try {
    const { mentor_id, title, description, price, duration } = req.body;
    if (!mentor_id || !title || !price) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
    if (!isObjectId(mentor_id)) {
      return res.status(400).json({ ok: false, error: 'Invalid mentor_id' });
    }

    // check mentor có tồn tại không
    const mentor = await Mentor.findById(mentor_id);
    if (!mentor) {
      return res.status(404).json({ ok: false, error: 'Mentor not found' });
    }

    const pricing = await MentorPricing.create({
      mentor_id,
      title,
      description,
      price,
      duration,
    });

    return res.status(201).json({ ok: true, data: pricing });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, error: 'Duplicate pricing title for this mentor' });
    }
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

// GET /mentor-pricing/:id
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const pricing = await MentorPricing.findById(id).populate('mentor_id', 'job_title company category');
    if (!pricing) return res.status(404).json({ ok: false, error: 'Not found' });

    return res.json({ ok: true, data: pricing });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

// GET /mentor-pricing?mentor_id=xxx
exports.list = async (req, res) => {
  try {
    const { mentor_id } = req.query;
    const filter = {};
    if (mentor_id) {
      if (!isObjectId(mentor_id)) return res.status(400).json({ ok: false, error: 'Invalid mentor_id' });
      filter.mentor_id = mentor_id;
    }

    const items = await MentorPricing.find(filter).sort({ created_at: -1 });
    return res.json({ ok: true, data: items });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

// PUT /mentor-pricing/:id
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const updateData = req.body;
    const updated = await MentorPricing.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ ok: false, error: 'Not found' });

    return res.json({ ok: true, data: updated });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, error: 'Duplicate pricing title for this mentor' });
    }
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};
/*******  684974d9-5732-4d30-aaab-9af6bf813b58  *******/

// DELETE /mentor-pricing/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const deleted = await MentorPricing.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ ok: false, error: 'Not found' });

    return res.json({ ok: true, data: deleted });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};
