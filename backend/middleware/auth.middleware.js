// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Role = require("../models/role.model");

// Xác thực JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Không tìm thấy token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }  // role có thể là tên ("MENTEE") HOẶC id
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

// Kiểm quyền: chấp nhận role name từ token hoặc tra DB nếu là ObjectId
const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ message: "Không có quyền" });
      }

      let roleName = null;

      // Nếu token đã chứa role name ("MENTEE" | "MENTOR" | "ADMIN")
      if (typeof req.user.role === 'string' && !mongoose.isValidObjectId(req.user.role)) {
        roleName = req.user.role; // dùng trực tiếp
      } else {
        // Nếu token chứa _id role -> tra DB lấy name
        const roleDoc = await Role.findById(req.user.role).lean();
        roleName = roleDoc?.name || null;
      }

      if (!roleName) return res.status(403).json({ message: "Role không tồn tại" });
      if (!allowedRoles.includes(roleName)) {
        return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
      }

      return next();
    } catch (err) {
      console.error('checkRole error:', err);
      return res.status(500).json({ message: "Lỗi server" });
    }
  };
};

module.exports = { authMiddleware, checkRole };
