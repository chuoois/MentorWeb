const Mentor = require("../models/mentor.model");
const Role = require("../models/role.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/mailer");
const crypto = require("crypto");

// Config từ .env
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES;

// ---------------------- REGISTER ----------------------
exports.register = async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      phone,
      avatar_url,
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
      location,
      price,
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (
      !email ||
      !password ||
      !full_name ||
      !phone ||
      !job_title ||
      !company ||
      !category ||
      !skill ||
      !bio ||
      !current_position
    ) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Kiểm tra email đã tồn tại
    const existingMentor = await Mentor.findOne({ email });
    if (existingMentor) {
      return res.status(400).json({ message: "Email đã được sử dụng" });
    }

    // Lấy role 'MENTOR'
    const role = await Role.findOne({ name: "MENTOR" });
    if (!role) return res.status(500).json({ message: "Role 'MENTOR' chưa được tạo" });

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Tạo mentor mới
    const newMentor = new Mentor({
      email,
      full_name,
      phone,
      password_hash,
      role: role._id,
      status: "PENDING",
      avatar_url,
      job_title,
      company,
      category,
      skill,
      bio,
      current_position,
      linkedin_url: linkedin_url || "",
      personal_link_url: personal_link_url || "",
      intro_video: intro_video || "",
      featured_article: featured_article || "",
      location: location || "",
      price: price || 0,
      submitted_at: new Date(), // Lúc đăng ký sẽ lưu thời điểm submit
    });

    await newMentor.save();

    res.status(201).json({
      message: "Đăng ký thành công",
      mentor: {
        id: newMentor._id,
        email: newMentor.email,
        full_name: newMentor.full_name,
        phone: newMentor.phone,
        role: role.name,
        job_title: newMentor.job_title,
        avatar_url: newMentor.avatar_url,
        company: newMentor.company,
        category: newMentor.category,
        skill: newMentor.skill,
        bio: newMentor.bio,
        current_position: newMentor.current_position,
        linkedin_url: newMentor.linkedin_url,
        personal_link_url: newMentor.personal_link_url,
        intro_video: newMentor.intro_video,
        featured_article: newMentor.featured_article,
        location: newMentor.location,
        price: newMentor.price,
        status: newMentor.status,
        submitted_at: newMentor.submitted_at,
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

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
      return res.status(400).json({ message: "Vui lòng cung cấp email và mật khẩu" });
    }

    // Kiểm tra kết nối database và truy vấn Mentor
    const mentor = await Mentor.findOne({ email }).populate("role");
    if (!mentor) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Kiểm tra trạng thái tài khoản
    if (mentor.status === "BANNED") {
      return res.status(403).json({ message: "Tài khoản bị khóa" });
    }

    // Kiểm tra mật khẩu
    if (!mentor.password_hash) {
      console.error("Lỗi: password_hash không tồn tại cho mentor", mentor);
      return res.status(500).json({ message: "Lỗi dữ liệu người dùng" });
    }
    const isMatch = await bcrypt.compare(password, mentor.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // Kiểm tra JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error("Lỗi: JWT_SECRET không được thiết lập");
      return res.status(500).json({ message: "Lỗi cấu hình server" });
    }

    // Tạo token
    const token = jwt.sign({ id: mentor._id, role: mentor.role.name }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    });

    // Trả về phản hồi
    res.json({
      message: "Đăng nhập thành công",
      token,
      mentor: {
        id: mentor._id,
        email: mentor.email,
        full_name: mentor.full_name,
        phone: mentor.phone,
        role: mentor.role.name,
        avatar_url: mentor.avatar_url,
        job_title: mentor.job_title,
        company: mentor.company,
      },
    });
  } catch (error) {
    console.error("Lỗi trong hàm login:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};
// ---------------------- LIST ACTIVE MENTORS ----------------------
exports.listActiveMentors = async (req, res) => {
  try {
    // Extract query parameters
    const {
      page = 1,
      limit = 10,
      search,
      category,
      skill,
      company,
      location,
      minPrice,
      maxPrice,
      sortBy = 'full_name',
      sortOrder = 'asc'
    } = req.query;

    // Build query object
    const query = { status: 'ACTIVE' };

    // Search by full_name, email, or bio
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by category
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    // Filter by skill
    if (skill) {
      query.skill = { $regex: skill, $options: 'i' };
    }

    // Filter by company
    if (company) {
      query.company = { $regex: company, $options: 'i' };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Validate sort parameters
    const validSortFields = ['full_name', 'price', 'company', 'createdAt'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'full_name';
    const sortDirection = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Fetch mentors with pagination, sorting, and populate role
    const mentors = await Mentor.find(query)
      .populate('role')
      .sort({ [sortField]: sortDirection })
      .skip(skip)
      .limit(limitNum)
      .select('-password_hash'); // Exclude password_hash from response

    // Get total count for pagination
    const total = await Mentor.countDocuments(query);

    // Prepare response
    const response = {
      message: "Danh sách mentor được lấy thành công",
      mentors: mentors.map(mentor => ({
        id: mentor._id,
        email: mentor.email,
        full_name: mentor.full_name,
        phone: mentor.phone,
        role: mentor.role?.name || 'MENTOR',
        avatar_url: mentor.avatar_url,
        job_title: mentor.job_title,
        company: mentor.company,
        category: mentor.category,
        skill: mentor.skill,
        bio: mentor.bio,
        current_position: mentor.current_position,
        linkedin_url: mentor.linkedin_url,
        personal_link_url: mentor.personal_link_url,
        intro_video: mentor.intro_video,
        featured_article: mentor.featured_article,
        location: mentor.location,
        price: mentor.price,
        status: mentor.status,
        createdAt: mentor.createdAt
      })),
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalItems: total,
        limit: limitNum
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- GET MENTOR BY ID ----------------------
exports.getMentorByID = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 Tìm mentor theo ID, populate role và mentee trong ratings
    const mentor = await Mentor.findById(id)
      .populate('role', 'name')
      .populate('ratings.mentee', 'full_name email')
      .select('-password_hash'); // Không trả về password_hash

    if (!mentor) {
      return res.status(404).json({ message: "Không tìm thấy mentor" });
    }

    // 🔹 Chuẩn bị dữ liệu trả về
    const response = {
      message: "Lấy thông tin mentor thành công",
      mentor: {
        id: mentor._id,
        email: mentor.email,
        full_name: mentor.full_name,
        phone: mentor.phone,
        role: mentor.role?.name || 'MENTOR',
        avatar_url: mentor.avatar_url,
        job_title: mentor.job_title,
        company: mentor.company,
        category: mentor.category,
        skill: mentor.skill,
        bio: mentor.bio,
        current_position: mentor.current_position,
        linkedin_url: mentor.linkedin_url,
        personal_link_url: mentor.personal_link_url,
        intro_video: mentor.intro_video,
        featured_article: mentor.featured_article,
        location: mentor.location,
        price: mentor.price,
        status: mentor.status,
        createdAt: mentor.createdAt,
        submitted_at: mentor.submitted_at,
        average_rating: mentor.average_rating || 0,
        ratings: mentor.ratings?.map(r => ({
          mentee: r.mentee
            ? {
                id: r.mentee._id,
                full_name: r.mentee.full_name,
                email: r.mentee.email
              }
            : null,
          score: r.score,
          comment: r.comment,
          created_at: r.created_at
        })) || []
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Lỗi khi lấy mentor theo ID:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// ---------------------- RECOMMEND MENTORS ----------------------
// Input (req.body):
// - skills: string | string[] (kỹ năng mong muốn)
// - budgetMin: number (VND)
// - budgetMax: number (VND)
// - location: string (tùy chọn)
// - limit: number (mặc định 10)
exports.recommend = async (req, res) => {
  try {
    const {
      skills,
      budgetMin,
      budgetMax,
      location,
      limit = 10,
    } = req.body || {};

    const normalizedSkills = Array.isArray(skills)
      ? skills
          .map((s) => String(s || "").toLowerCase().trim())
          .filter((s) => s.length > 0)
      : String(skills || "")
          .split(/[,;/]/)
          .map((s) => s.toLowerCase().trim())
          .filter((s) => s.length > 0);

    const priceFilter = {};
    if (budgetMin !== undefined && budgetMin !== null) priceFilter.$gte = Number(budgetMin);
    if (budgetMax !== undefined && budgetMax !== null) priceFilter.$lte = Number(budgetMax);

    const query = { status: 'ACTIVE' };
    if (Object.keys(priceFilter).length) query.price = priceFilter;
    if (location) query.location = { $regex: location, $options: 'i' };

    const mentors = await Mentor.find(query).select('-password_hash').lean();

    const scored = mentors.map((m) => {
      const mentorSkills = String(m.skill || '')
        .toLowerCase()
        .split(/[,;/]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      let skillMatches = 0;
      if (normalizedSkills.length > 0) {
        const mentorSkillSet = new Set(mentorSkills);
        for (const s of normalizedSkills) if (mentorSkillSet.has(s)) skillMatches += 1;
      }

      const skillScore = normalizedSkills.length > 0
        ? skillMatches / normalizedSkills.length
        : 0;

      let budgetScore = 0;
      if (m.price != null) {
        const price = Number(m.price);
        const minOk = budgetMin == null || price >= Number(budgetMin);
        const maxOk = budgetMax == null || price <= Number(budgetMax);
        budgetScore = minOk && maxOk ? 1 : 0;
      }

      const finalScore = skillScore * 0.7 + budgetScore * 0.3;

      return {
        mentor: m,
        score: Number(finalScore.toFixed(4)),
        breakdown: {
          skillScore: Number(skillScore.toFixed(4)),
          budgetScore: Number(budgetScore.toFixed(4)),
          matchedSkills: mentorSkills.filter((s) => normalizedSkills.includes(s)),
        },
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const result = scored.slice(0, Number(limit));

    return res.json({
      ok: true,
      total: scored.length,
      returned: result.length,
      data: result,
    });
  } catch (error) {
    console.error('recommend error:', error);
    res.status(500).json({ ok: false, message: 'Server error', error: error.message });
  }
};

// ---------------------- GET 8 MENTORS NEW ----------------------
exports.get8MentorsNew = async (req, res) => {
  try {
    const mentors = await Mentor.find({ status: 'ACTIVE' }).limit(8).sort({ createdAt: -1 }).select('-password_hash').lean();
    return res.json({ ok: true, data: mentors });
  } catch (error) {
    console.error('get 8 mentors new error:', error);
    res.status(500).json({ ok: false, message: 'Server error', error: error.message });
  }
};

// ---------------------- GET 8 MENTORS Rating DESC ----------------------
exports.get8MentorsRating = async (req, res) => {
  try {
    const mentors = await Mentor.find({ status: 'ACTIVE' }).limit(8).sort({ rating: -1 }).select('-password_hash').lean();
    return res.json({ ok: true, data: mentors });
  } catch (error) {
    console.error('get 8 mentors rating error:', error);
    res.status(500).json({ ok: false, message: 'Server error', error: error.message });
  }
};