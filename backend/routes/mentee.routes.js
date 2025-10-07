const express = require("express");
const router = express.Router();
const c = require("../controller/mentee.controller");
const { authMiddleware, checkRole } = require("../middleware/auth.middleware");

// POST /api/mentees/register
router.post("/register", c.register);

// POST /api/mentees/login
router.post("/login", c.login);

// POST /api/mentees/forgot-password
router.post("/forgot-password", c.forgotPassword);

// POST /api/mentees/login-with-google
router.post("/login-with-google", c.loginWithGoogle);

// GET /api/mentees/:id
router.get("/", authMiddleware, c.getProfile);

// PUT /api/mentees/update/:id
router.put("/update", authMiddleware, c.updateProfile);

// DELETE /api/mentees/delete/:id
router.delete("/delete", authMiddleware, c.deleteAccount);

module.exports = router;
