// backend/middleware/auth.middleware.js
const jwt = require('jsonwebtoken');
const Role = require("../models/role.model");

// Middleware để xác thực token
const authMiddleware = (req, res, next) => {
  // Lấy token từ header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Không tìm thấy token' });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng từ token vào request
    next(); // Chuyển tiếp đến route handler
  } catch (error) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};
// Middleware để xác quyền
const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user || !req.user.role) return res.status(403).json({ message: "Không có quyền" });

    try {
      const role = await Role.findById(req.user.role);
      if (!role) return res.status(403).json({ message: "Role không tồn tại" });

      if (allowedRoles.includes(role.name)) return next();
      return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
    } catch (err) {
      return res.status(500).json({ message: "Lỗi server" });
    }
  };
};


module.exports = { authMiddleware, checkRole };