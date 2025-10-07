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

    const mentor = await Mentor.findOne({ email }).populate("role");
    if (!mentor) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    if (mentor.status === "BANNED") {
      return res.status(403).json({ message: "Tài khoản bị khóa" });
    }

    const isMatch = await bcrypt.compare(password, mentor.password_hash);
    if (!isMatch) return res.status(400).json({ message: "Email hoặc mật khẩu không đúng" });

    const token = jwt.sign({ id: mentor._id, role: mentor.role.name }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

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
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
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

    // Find mentor by ID and populate role
    const mentor = await Mentor.findById(id)
      .populate('role')
      .select('-password_hash'); // Exclude password_hash from response

    // Check if mentor exists
    if (!mentor) {
      return res.status(404).json({ message: "Không tìm thấy mentor" });
    }

    // Prepare response
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
        submitted_at: mentor.submitted_at
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};