const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const Mentee = require('../models/mentee.model');
const SALT_ROUNDS = 10;

const sanitize = (doc) => {
  const o = doc.toObject ? doc.toObject() : { ...doc };
  delete o.password_hash;
  return o;
};

// helper: đảm bảo có mentee cho user_id (idempotent)
async function ensureMentee(userId) {
  await Mentee.updateOne(
    { user_id: userId },
    { $setOnInsert: { user_id: userId } },
    { upsert: true }
  );
}

// helper: xóa mentee theo user_id (dọn rác khi đổi role khác MENTEE hoặc xóa user)
async function removeMentee(userId) {
  await Mentee.deleteOne({ user_id: userId });
}

exports.list = async (req, res, next) => {
  try {
    const { search = '', page = 1, pageSize = 20, role, status } = req.query;
    const limit = Math.max(parseInt(pageSize) || 20, 1);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

    const q = {};
    if (search) q.$or = [
      { email: { $regex: search, $options: 'i' } },
      { full_name: { $regex: search, $options: 'i' } }
    ];
    if (role) q.role = role;
    if (status) q.status = status;

    const [items, total] = await Promise.all([
      User.find(q).sort({ _id: -1 }).skip(skip).limit(limit),
      User.countDocuments(q)
    ]);
    res.json({ total, items: items.map(sanitize) });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const doc = await User.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'ADMIN' && req.user.id !== doc._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(sanitize(doc));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    let { email, password, full_name, phone, role='MENTEE', status='PENDING', avatar_url } = req.body || {};
    if (!email || !password || !full_name) {
      return res.status(400).json({ message: 'email, password, full_name là bắt buộc' });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const doc = await User.create({
      email: String(email).toLowerCase(),
      phone,
      password_hash,
      full_name,
      avatar_url,
      role,
      status,
      email_verified: false
    });

    if (doc.role === 'MENTEE') {
      try { await ensureMentee(doc._id); } catch (e) { /* bỏ qua nếu race/duplicate */ }
    }

    res.status(201).json(sanitize(doc));
  } catch (err) {
    if (err.code === 11000) return next({ status: 409, message: 'Email/phone đã tồn tại' });
    next(err);
  }
};

exports.updatePut = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isAdmin = req.user.role === 'ADMIN';
    if (!isAdmin && req.user.id !== id) return res.status(403).json({ message: 'Forbidden' });

    const { email, full_name, phone, avatar_url, role, status, password } = req.body || {};
    const update = {};
    if (email) update.email = String(email).toLowerCase();
    if (full_name) update.full_name = full_name;
    if (phone !== undefined) update.phone = phone || undefined;
    if (avatar_url !== undefined) update.avatar_url = avatar_url;
    if (isAdmin) { if (role) update.role = role; if (status) update.status = status; }
    if (password) update.password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const before = await User.findById(id);
    if (!before) return res.status(404).json({ message: 'Not found' });

    const doc = await User.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (isAdmin && role) {
      if (doc.role === 'MENTEE') {
        try { await ensureMentee(doc._id); } catch (e) {}
      } else if (before.role === 'MENTEE' && doc.role !== 'MENTEE') {
        // tuỳ chính sách: nếu đổi role khỏi MENTEE thì xoá mentee
        try { await removeMentee(doc._id); } catch (e) {}
      }
    }

    res.json(sanitize(doc));
  } catch (err) {
    if (err.code === 11000) return next({ status: 409, message: 'Email/phone đã tồn tại' });
    next(err);
  }
};

exports.updatePatch = async (req, res, next) => {
  try {
    const id = req.params.id;
    const isAdmin = req.user.role === 'ADMIN';
    if (!isAdmin && req.user.id !== id) return res.status(403).json({ message: 'Forbidden' });

    const allow = ['email','full_name','phone','avatar_url'];
    if (isAdmin) allow.push('role','status');

    const update = {};
    for (const k of allow) if (k in req.body) {
      update[k] = (k === 'email' && req.body[k]) ? String(req.body[k]).toLowerCase() : req.body[k];
    }

    const before = await User.findById(id);
    if (!before) return res.status(404).json({ message: 'Not found' });

    const doc = await User.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ message: 'Not found' });

    if (isAdmin && 'role' in update) {
      if (doc.role === 'MENTEE') {
        try { await ensureMentee(doc._id); } catch (e) {}
      } else if (before.role === 'MENTEE' && doc.role !== 'MENTEE') {
        try { await removeMentee(doc._id); } catch (e) {}
      }
    }

    res.json(sanitize(doc));
  } catch (err) {
    if (err.code === 11000) return next({ status: 409, message: 'Email/phone đã tồn tại' });
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const r = await User.findByIdAndDelete(req.params.id);
    if (!r) return res.status(404).json({ message: 'Not found' });

    try { await removeMentee(r._id); } catch (e) {}

    res.status(204).send();
  } catch (err) { next(err); }
};
