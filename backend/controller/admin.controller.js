// backend/controller/admin.controller.js
const User = require("../models/user.model");
const Mentor = require("../models/mentor.model");
const Mentee = require("../models/mentee.model");
const MentorPricing = require("../models/mentorPricing.model");
const MentorOrder = require("../models/mentorOrder.model");
const MentorFeedback = require("../models/mentorFeedback.model");

const sanitize = (doc) => (doc?.toObject ? doc.toObject() : { ...doc });

/* ===============================
   USERS MANAGEMENT
   =============================== */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { search = "", page = 1, pageSize = 20 } = req.query;
    const limit = Math.max(parseInt(pageSize) || 20, 1);
    const skip = (Math.max(parseInt(page) || 1, 1) - 1) * limit;

    const q = search
      ? {
          $or: [
            { full_name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      User.find(q).sort({ created_at: -1 }).skip(skip).limit(limit),
      User.countDocuments(q),
    ]);

    res.json({ total, items: items.map(sanitize) });
  } catch (err) {
    next(err);
  }
};

// Update role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["ADMIN", "MENTOR", "MENTEE"].includes(role))
      return res.status(400).json({ error: "Invalid role" });

    const user = await User.findByIdAndUpdate(id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Role updated", data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// Update status
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["ACTIVE", "INACTIVE", "BANNED", "PENDING"].includes(status))
      return res.status(400).json({ error: "Invalid status" });

    const user = await User.findByIdAndUpdate(id, { status }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Status updated", data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// Toggle email_verified
exports.toggleEmailVerified = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    user.email_verified = !user.email_verified;
    await user.save();
    res.json({ message: "Email verification toggled", verified: user.email_verified });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   MENTOR MODERATION
   =============================== */
exports.getPendingMentors = async (req, res, next) => {
  try {
    const mentors = await Mentor.find()
      .populate({
        path: "user_id",
        match: { status: "PENDING", role: "MENTOR" },
        select: "full_name email status",
      })
      .lean();
    const filtered = mentors.filter((m) => m.user_id);
    res.json({ total: filtered.length, items: filtered });
  } catch (err) {
    next(err);
  }
};

// Approve mentor
exports.approveMentor = async (req, res, next) => {
  try {
    const { id } = req.params; // user_id
    // set role to MENTOR and status to ACTIVE
    const user = await User.findByIdAndUpdate(
      id,
      { role: 'MENTOR', status: 'ACTIVE' },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Mentor approved", data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

// Reject mentor
exports.rejectMentor = async (req, res, next) => {
  try {
    const { id } = req.params;
    // revert to MENTEE role and set status to INACTIVE (app rejected)
    const user = await User.findByIdAndUpdate(
      id,
      { role: 'MENTEE', status: 'INACTIVE' },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Mentor rejected", data: sanitize(user) });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   PRICING MANAGEMENT
   =============================== */
exports.getAllPricing = async (req, res, next) => {
  try {
    const pricings = await MentorPricing.find()
      .populate("mentor_id", "user_id job_title")
      .sort({ created_at: -1 });
    res.json({ total: pricings.length, items: pricings.map(sanitize) });
  } catch (err) {
    next(err);
  }
};

exports.deletePricing = async (req, res, next) => {
  try {
    const deleted = await MentorPricing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Pricing not found" });
    res.json({ message: "Pricing deleted" });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   ORDER MANAGEMENT
   =============================== */
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await MentorOrder.find()
      .populate("mentor_id", "user_id job_title")
      .populate("mentee_id", "user_id")
      .populate("pricing_id", "title price")
      .sort({ created_at: -1 });
    res.json({ total: orders.length, items: orders.map(sanitize) });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["PENDING", "PAID", "COMPLETED", "CANCELED"].includes(status))
      return res.status(400).json({ error: "Invalid status" });
    const order = await MentorOrder.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json({ message: "Order status updated", data: sanitize(order) });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   FEEDBACK MANAGEMENT
   =============================== */
exports.getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await MentorFeedback.find()
      .populate("mentor_id", "user_id")
      .populate("mentee_id", "user_id")
      .populate("order_id", "status")
      .sort({ created_at: -1 });
    res.json({ total: feedbacks.length, items: feedbacks.map(sanitize) });
  } catch (err) {
    next(err);
  }
};

exports.deleteFeedback = async (req, res, next) => {
  try {
    const deleted = await MentorFeedback.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    next(err);
  }
};
