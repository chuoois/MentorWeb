const express = require("express");
const router = express.Router();
const c = require("../controller/mentor.controller");

// POST /api/mentors/register
router.post("/register", c.register);

// POST /api/mentors/login
router.post("/login", c.login);

// GET /api/mentors/
router.get("/", c.listActiveMentors);

// GET /api/mentors/new
router.get("/new", c.get8MentorsNew);

// GET /api/mentors/rating
router.get("/rating", c.get8MentorsRating);

// POST /api/mentors/recommend
router.post("/recommend", c.recommend);

// GET /api/mentors/:id
router.get("/:id", c.getMentorByID);

module.exports = router;