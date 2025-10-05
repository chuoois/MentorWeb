// controllers/mentees.controller.js
const mongoose = require('mongoose');
const Mentee = require('../models/mentee.model');        // đường dẫn tùy dự án của bạn
const User = require('../models/user.model');            // cần model User để kiểm tra tồn tại

// Helper: validate ObjectId
function isObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// POST /mentees
// body: { user_id: "..." }
exports.create = async (req, res) => {
  try {
    const { user_id } = req.body;
    if (!user_id) return res.status(400).json({ ok: false, error: 'Missing user_id' });
    if (!isObjectId(user_id)) return res.status(400).json({ ok: false, error: 'Invalid user_id' });

    // user phải tồn tại
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

    // tránh trùng mentee theo user_id
    const existed = await Mentee.findOne({ user_id });
    if (existed) return res.status(409).json({ ok: false, error: 'Mentee already exists for this user' });

    const mentee = await Mentee.create({ user_id });

    // OPTIONAL: nếu muốn tự động set role user là MENTEE (bỏ comment nếu cần)
    // if (user.role !== 'MENTEE') {
    //   user.role = 'MENTEE';
    //   await user.save();
    // }

    return res.status(201).json({ ok: true, data: mentee });
  } catch (err) {
    // xử lý lỗi unique index trùng user_id
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, error: 'Duplicate user_id for mentee' });
    }
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

// GET /mentees
// query: search, page=1, pageSize=20
// search theo email/full_name của User
exports.list = async (req, res) => {
  try {
    const { search = '', page = 1, pageSize = 20 } = req.query;
    const limit = Math.max(parseInt(pageSize) || 20, 1);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

    const pipeline = [
      { $lookup: { from: 'users', localField: 'user_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'user.email': { $regex: search, $options: 'i' } },
            { 'user.full_name': { $regex: search, $options: 'i' } },
          ],
        },
      });
    }

    const facet = await Mentee.aggregate([
      ...pipeline,
      { $sort: { _id: -1 } },
      {
        $facet: {
          items: [{ $skip: skip }, { $limit: limit }],
          totalRows: [{ $count: 'count' }],
        },
      },
    ]);

    const items = facet[0]?.items || [];
    const total = facet[0]?.totalRows?.[0]?.count || 0;

    return res.json({
      ok: true,
      data: items,
      pagination: {
        page: Number(page),
        pageSize: limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

// GET /mentees/:id
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const mentee = await Mentee.findById(id).populate('user_id');
    if (!mentee) return res.status(404).json({ ok: false, error: 'Mentee not found' });

    return res.json({ ok: true, data: mentee });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

// GET /mentees/by-user/:userId  (lấy theo user_id)
exports.getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isObjectId(userId)) return res.status(400).json({ ok: false, error: 'Invalid userId' });

    const mentee = await Mentee.findOne({ user_id: userId }).populate('user_id');
    if (!mentee) return res.status(404).json({ ok: false, error: 'Mentee not found' });

    return res.json({ ok: true, data: mentee });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

// PATCH /mentees/:id
// body: { user_id?: "..." } — chủ yếu để đổi sang user khác (hiếm khi dùng)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const updates = {};
    if (req.body.user_id !== undefined) {
      if (!isObjectId(req.body.user_id)) return res.status(400).json({ ok: false, error: 'Invalid user_id' });
      // kiểm tra user tồn tại
      const user = await User.findById(req.body.user_id);
      if (!user) return res.status(404).json({ ok: false, error: 'User not found' });

      // tránh trùng mentee khác đã dùng user_id này
      const dup = await Mentee.findOne({ user_id: req.body.user_id, _id: { $ne: id } });
      if (dup) return res.status(409).json({ ok: false, error: 'user_id already used by another mentee' });

      updates.user_id = req.body.user_id;
    }

    const mentee = await Mentee.findByIdAndUpdate(id, updates, { new: true }).populate('user_id');
    if (!mentee) return res.status(404).json({ ok: false, error: 'Mentee not found' });

    return res.json({ ok: true, data: mentee });
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ ok: false, error: 'Duplicate user_id for mentee' });
    }
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};

// DELETE /mentees/:id
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isObjectId(id)) return res.status(400).json({ ok: false, error: 'Invalid id' });

    const mentee = await Mentee.findByIdAndDelete(id);
    if (!mentee) return res.status(404).json({ ok: false, error: 'Mentee not found' });

    return res.json({ ok: true, data: { deleted_id: id } });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message || 'Server error' });
  }
};
