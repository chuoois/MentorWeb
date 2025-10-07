const Mentee = require("../models/mentee.model");
const Mentor = require("../models/mentor.model");
const Role = require("../models/role.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/mailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");

// Config từ .env
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const APP_LOGIN_URL = process.env.APP_LOGIN_URL || "http://localhost:5173/auth/login";
const APP_NAME = process.env.APP_NAME || "MentorHub";

// ---------------------- REGISTER ----------------------
exports.register = async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;

    // Kiểm tra email đã tồn tại
    const existingMentee = await Mentee.findOne({ email });
    if (existingMentee) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Lấy role 'MENTEE'
    const role = await Role.findOne({ name: "MENTEE" });
    if (!role) {
      return res.status(500).json({ message: "Role 'MENTEE' chưa được tạo" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Tạo mentee mới
    const newMentee = new Mentee({
      email,
      full_name,
      phone,
      password_hash,
      role: role._id,
    });

    await newMentee.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      mentee: {
        id: newMentee._id,
        email: newMentee.email,
        full_name: newMentee.full_name,
        phone: newMentee.phone,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- LOGIN ----------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mentee = await Mentee.findOne({ email }).populate("role");
    if (!mentee) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    if (mentee.status === "BANNED") {
      return res.status(403).json({ message: "Tài khoản bị khóa" });
    }

    const isMatch = await bcrypt.compare(password, mentee.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = jwt.sign({ id: mentee._id, role: mentee.role.name }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      mentee: {
        id: mentee._id,
        email: mentee.email,
        full_name: mentee.full_name,
        phone: mentee.phone,
        role: mentee.role.name,
        avatar_url: mentee.avatar_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- FORGOT PASSWORD ----------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Tìm mentee hoặc mentor theo email
    let user = await Mentee.findOne({ email });
    let userType = "mentee";

    if (!user) {
      user = await Mentor.findOne({ email });
      userType = "mentor";
    }

    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại" });
    }

    // Tạo mật khẩu tạm thời 8 ký tự
    const tempPassword = crypto.randomBytes(4).toString("hex");

    // Hash và lưu vào DB
    user.password_hash = await bcrypt.hash(tempPassword, 10);
    await user.save();

    const subject = `${APP_NAME} - Mật khẩu mới của bạn`;
    const html = `
      <p>Xin chào <strong>${user.full_name}</strong>,</p>
      <p>Mật khẩu mới tạm thời của bạn là: <strong>${tempPassword}</strong></p>
      <p>Vui lòng <a href="${APP_LOGIN_URL}">đăng nhập</a> và đổi mật khẩu ngay sau khi nhận được email này.</p>
    `;

    await sendMail({ to: user.email, subject, html });

    res.json({ message: "Mật khẩu mới đã được gửi vào email của bạn" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- LOGIN WITH GOOGLE ----------------------
exports.loginWithGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) return res.status(400).json({ message: "Missing idToken" });

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let mentee = await Mentee.findOne({ email }).populate("role");

    if (!mentee) {
      const role = await Role.findOne({ name: "MENTEE" });
      if (!role) return res.status(500).json({ message: "Role 'MENTEE' chưa được tạo" });

      mentee = new Mentee({
        email,
        full_name: name,
        password_hash: "", // Google login không cần password
        role: role._id,
        avatar_url: picture,
      });
      await mentee.save();
      await mentee.populate("role");
    }

    if (mentee.status === "BANNED") {
      return res.status(403).json({ message: "Tài khoản bị khóa" });
    }

    const token = jwt.sign({ id: mentee._id, role: mentee.role.name }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      mentee: {
        id: mentee._id,
        email: mentee.email,
        full_name: mentee.full_name,
        phone: mentee.phone,
        role: mentee.role.name,
        avatar_url: mentee.avatar_url,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- GET PROFILE ----------------------
exports.getProfile = async (req, res) => {
  try {
    const menteeId = req.user.id;

    const mentee = await Mentee.findById(menteeId).select("-password_hash");
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });

    res.status(200).json(mentee);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------- UPDATE PROFILE ----------------------
exports.updateProfile = async (req, res) => {
  try {
    const menteeId = req.user.id;
    console.log("req.user:", req.user);
    const { full_name, phone, gpa, experience, motivation, password, confirm_password } = req.body;

    const mentee = await Mentee.findById(menteeId);
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });

    // Cập nhật thông tin cơ bản
    if (full_name) mentee.full_name = full_name;
    if (phone) mentee.phone = phone;
    if (gpa !== undefined) mentee.gpa = gpa;
    if (experience !== undefined) mentee.experience = experience;
    if (motivation !== undefined) mentee.motivation = motivation;

    // Cập nhật mật khẩu nếu có
    if (password) {
      if (!confirm_password) {
        return res.status(400).json({ message: "Vui lòng nhập xác nhận mật khẩu" });
      }
      if (password !== confirm_password) {
        return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
      }
      // Hash mật khẩu mới
      mentee.password_hash = await bcrypt.hash(password, 10);
    }

    await mentee.save();

    // Lấy lại thông tin mentee không bao gồm password_hash
    const updatedMentee = await Mentee.findById(menteeId).select("-password_hash");

    res.status(200).json({ message: "Cập nhật hồ sơ thành công", mentee: updatedMentee });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- DELETE ACCOUNT ----------------------
exports.deleteAccount = async (req, res) => {
  try {
    const menteeId = req.user.id;

    const mentee = await Mentee.findByIdAndDelete(menteeId);
    if (!mentee) return res.status(404).json({ message: "Mentee not found" });

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error" });
  }
};