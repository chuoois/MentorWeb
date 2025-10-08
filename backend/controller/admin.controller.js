// controller/admin.controller.js
const Admin = require("../models/admin.model");
const Mentee = require("../models/mentee.model");
const Mentor = require("../models/mentor.model");
const Role = require("../models/role.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES || "7d";

// ---------------------- ADMIN LOGIN ----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).populate("role");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "ADMIN" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        token,
        admin: {
          id: admin._id,
          email: admin.email,
          full_name: admin.full_name,
          role: admin.role?.name || "ADMIN",
        },
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------------- LIST MENTORS ----------------------
exports.getMentors = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { full_name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { company: new RegExp(search, "i") },
        { job_title: new RegExp(search, "i") },
      ];
    }

    const total = await Mentor.countDocuments(query);
    const mentors = await Mentor.find(query)
      .populate("role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        total,
        page,
        limit,
        mentors,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------------- LIST MENTEES ----------------------
exports.getMentees = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = "", status } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { full_name: new RegExp(search, "i") },
        { email: new RegExp(search, "i") },
        { phone: new RegExp(search, "i") },
      ];
    }

    const total = await Mentee.countDocuments(query);
    const mentees = await Mentee.find(query)
      .populate("role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      data: {
        total,
        page,
        limit,
        mentees,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------------- MENTOR DETAIL ----------------------
exports.getMentorDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const mentor = await Mentor.findById(id).populate("role reviewed_by", "full_name email");

    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    res.json({ success: true, data: mentor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------------- MENTEE DETAIL ----------------------
exports.getMenteeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const mentee = await Mentee.findById(id).populate("role", "name");

    if (!mentee) return res.status(404).json({ success: false, message: "Mentee not found" });

    res.json({ success: true, data: mentee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ---------------------- CHANGE MENTOR STATUS ----------------------
exports.changeMentorStatus = async (req, res) => {
  try {
    const adminId = req.user.id; // lấy từ middleware auth
    const { id } = req.params;
    const { status, review_note } = req.body;

    if (!["PENDING", "ACTIVE", "REJECTED", "BANNED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const mentor = await Mentor.findById(id);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    mentor.status = status;
    mentor.reviewed_by = adminId;
    mentor.review_note = review_note || "";
    mentor.reviewed_at = new Date();

    await mentor.save();

    res.json({
      success: true,
      message: `Mentor status changed to ${status}`,
      data: mentor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
