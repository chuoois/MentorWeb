const Mentor = require("../models/mentor.model");
const User = require("../models/user.model");

const sanitize = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });

// GET /api/mentors
// - Public: chỉ thấy mentor ACTIVE
// - Admin: thấy tất cả
exports.list = async (req, res, next) => {
  try {
    const { search = "", page = 1, pageSize = 20, category } = req.query;
    const limit = Math.max(parseInt(pageSize) || 20, 1);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

    const q = {};
    if (search) {
      q.$or = [
        { job_title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { skill: { $regex: search, $options: "i" } },
        { bio: { $regex: search, $options: "i" } },
      ];
    }
    if (category) q.category = category;

    // nếu không phải ADMIN thì chỉ show mentors có user.status = ACTIVE
    const userMatch = req.user?.role === "ADMIN" ? {} : { status: "ACTIVE" };

    const [items, total] = await Promise.all([
      Mentor.find(q)
        .populate({
          path: "user_id",
          select: "full_name email avatar_url role status",
          match: userMatch,
        })
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit),
      Mentor.countDocuments(q),
    ]);

    // lọc bỏ mentor mà populate bị null (vì user không match ACTIVE)
    const visible = items.filter((m) => m.user_id);
    res.json({ total: req.user?.role === "ADMIN" ? total : visible.length, items: visible.map(sanitize) });
  } catch (err) {
    next(err);
  }
};

// GET /api/mentors/:id
// - Public: chỉ xem được nếu mentor đó ACTIVE
// - Admin: xem tất cả
exports.getOne = async (req, res, next) => {
  try {
    const m = await Mentor.findById(req.params.id).populate("user_id", "full_name email avatar_url role status");
    if (!m) return res.status(404).json({ message: "Not found" });
    if (req.user?.role !== "ADMIN" && m.user_id?.status !== "ACTIVE") {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(sanitize(m));
  } catch (err) {
    next(err);
  }
};

// POST /api/mentors
// - ADMIN tạo cho bất kỳ user role=MENTOR
// - MENTOR chỉ được tạo cho chính mình (user_id === req.user.id)
exports.create = async (req, res, next) => {
  try {
    const { user_id, job_title, company, category, skill, bio, current_position, linkedin_url, personal_link_url, intro_video, featured_article, cv_img, question } = req.body || {};

    const user = await User.findById(user_id);
    if (!user || user.role !== "MENTOR") return res.status(400).json({ message: "User is not a mentor" });

    const isAdmin = req.user.role === "ADMIN";
    if (!isAdmin && req.user.id !== String(user_id)) {
      return res.status(403).json({ message: "You can only create your own mentor profile" });
    }

    const existed = await Mentor.findOne({ user_id });
    if (existed) return res.status(409).json({ message: "Mentor profile already exists" });

    const doc = await Mentor.create({
      user_id,
      job_title,
      company,
      category,
      skill,
      bio,
      current_position,
      linkedin_url,
      personal_link_url,
      intro_video,
      featured_article,
      question,
      cv_img,
    });

    res.status(201).json(sanitize(doc));
  } catch (err) {
    next(err);
  }
};

// POST /api/mentors/apply - mentee applies to become mentor
// This will set the user's role to MENTOR and status to PENDING so admin can review
exports.apply = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If user already a mentor and active, no need to apply
    if (user.role === 'MENTOR' && user.status === 'ACTIVE') {
      return res.status(400).json({ message: 'Already a mentor' });
    }

    // Set role to MENTOR and status to PENDING so admin can approve
    user.role = 'MENTOR';
    user.status = 'PENDING';
    await user.save();

    // ensure mentor profile exists (User model has hook to create Mentor on save)

    res.status(200).json({ message: 'Applied for mentor. Waiting for admin approval.' });
  } catch (err) {
    next(err);
  }
};

// PUT /api/mentors/:id  (admin hoặc chính chủ mentor)
exports.updatePut = async (req, res, next) => {
  try {
    const id = req.params.id;

    const m = await Mentor.findById(id).populate("user_id", "_id");
    if (!m) return res.status(404).json({ message: "Not found" });

    const isAdmin = req.user.role === "ADMIN";
    const isOwner = String(m.user_id?._id) === req.user.id;
    if (!isAdmin && !isOwner) return res.status(403).json({ message: "Forbidden" });

    const {
      job_title,
      company,
      category,
      skill,
      bio,
      current_position,
      linkedin_url,
      personal_link_url,
      intro_video,
      featured_article,
      question,
      cv_img,
    } = req.body || {};

    const update = {
      job_title,
      company,
      category,
      skill,
      bio,
      current_position,
      linkedin_url,
      personal_link_url,
      intro_video,
      featured_article,
      question,
      cv_img,
    };

    const doc = await Mentor.findByIdAndUpdate(id, update, { new: true });
    res.json(sanitize(doc));
  } catch (err) {
    next(err);
  }
};

// PATCH /api/mentors/:id  (admin hoặc chính chủ mentor)
exports.updatePatch = async (req, res, next) => {
  try {
    const id = req.params.id;

    const m = await Mentor.findById(id).populate("user_id", "_id");
    if (!m) return res.status(404).json({ message: "Not found" });

    const isAdmin = req.user.role === "ADMIN";
    const isOwner = String(m.user_id?._id) === req.user.id;
    if (!isAdmin && !isOwner) return res.status(403).json({ message: "Forbidden" });

    const allow = [
      "job_title",
      "company",
      "category",
      "skill",
      "bio",
      "current_position",
      "linkedin_url",
      "personal_link_url",
      "intro_video",
      "featured_article",
      "question",
      "cv_img",
    ];
    const update = {};
    for (const k of allow) if (k in req.body) update[k] = req.body[k];

    const doc = await Mentor.findByIdAndUpdate(id, update, { new: true });
    res.json(sanitize(doc));
  } catch (err) {
    next(err);
  }
};

// DELETE /api/mentors/:id  (chỉ ADMIN)
exports.remove = async (req, res, next) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
