// backend/routes/admin.routes.js
const router = require("express").Router();
const admin = require("../controller/admin.controller");
const { authRequired, roleRequired } = require("../middleware/auth.middleware");

// Áp dụng middleware cho toàn bộ router
router.use(authRequired, roleRequired("ADMIN"));

/* ========== USERS ========== */
router.get("/users", admin.getAllUsers);
router.patch("/users/:id/role", admin.updateUserRole);
router.patch("/users/:id/status", admin.updateUserStatus);
router.patch("/users/:id/verify", admin.toggleEmailVerified);

/* ========== MENTORS ========== */
router.get("/mentors/pending", admin.getPendingMentors);
router.patch("/mentors/:id/approve", admin.approveMentor);
router.patch("/mentors/:id/reject", admin.rejectMentor);

/* ========== PRICING ========== */
router.get("/pricing", admin.getAllPricing);
router.delete("/pricing/:id", admin.deletePricing);

/* ========== ORDERS ========== */
router.get("/orders", admin.getAllOrders);
router.patch("/orders/:id/status", admin.updateOrderStatus);

/* ========== FEEDBACK ========== */
router.get("/feedback", admin.getAllFeedback);
router.delete("/feedback/:id", admin.deleteFeedback);

module.exports = router;
