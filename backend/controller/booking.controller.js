const Booking = require("../models/booking.model");
const Mentor = require("../models/mentor.model");

// ---------------------- CREATE BOOKING ----------------------
exports.createBooking = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { mentorId, session_times, note } = req.body; // session_times = [{ start_time, end_time }, ...]

    if (!session_times || !Array.isArray(session_times) || session_times.length === 0) {
      return res.status(400).json({ message: "Phải cung cấp ít nhất 1 buổi học với thời gian bắt đầu và kết thúc" });
    }

    const mentor = await Mentor.findOne({ _id: mentorId, status: "ACTIVE" });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor không tồn tại hoặc không hoạt động" });
    }

    // Kiểm tra trùng lịch cho từng buổi
    for (const session of session_times) {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);

      if (end <= start) {
        return res.status(400).json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu của từng buổi" });
      }

      const conflictingBooking = await Booking.findOne({
        "session_times": {
          $elemMatch: {
            $or: [
              { start_time: { $lte: start }, end_time: { $gt: start } },
              { start_time: { $lt: end }, end_time: { $gte: end } },
              { start_time: { $gte: start }, end_time: { $lte: end } },
            ],
          },
        },
        status: { $in: ["PENDING", "CONFIRMED"] },
      });

      if (conflictingBooking) {
        const startVN = new Date(start).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
        const endVN = new Date(end).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

        return res.status(409).json({
          message: `Lịch của mentor bị trùng với buổi từ ${startVN} đến ${endVN}`,
        });
      }
    }

    // Tính tổng thời lượng và giá
    const durations = session_times.map(s => (new Date(s.end_time) - new Date(s.start_time)) / (1000 * 60 * 60));
    const totalDuration = durations.reduce((a, b) => a + b, 0);
    const sessions = session_times.length;
    const price = mentor.price * totalDuration;

    // Khởi tạo session_times theo model mới
    const formattedSessions = session_times.map(s => ({
      start_time: new Date(s.start_time),
      end_time: new Date(s.end_time),
      meeting_link: s.meeting_link || "", // Có thể để rỗng, mentor thêm sau
      status: "UPCOMING",
      mentor_confirmed: false,
      note: "",
    }));

    const newBooking = new Booking({
      mentee: menteeId,
      mentor: mentorId,
      duration: totalDuration,
      sessions,
      session_times: formattedSessions,
      price,
      status: "PENDING",
      paymentStatus: "PENDING",
      note,
    });

    await newBooking.save();

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("mentee", "full_name email")
      .populate("mentor", "full_name job_title company price");

    res.status(201).json({
      message: "Tạo booking thành công",
      booking: populatedBooking,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- GET BOOKED SLOTS (MENTOR) ----------------------
exports.getBookedSlots = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findOne({ _id: mentorId, status: "ACTIVE" });
    if (!mentor) return res.status(404).json({ message: "Mentor không tồn tại hoặc không hoạt động" });

    const bookings = await Booking.find({
      mentor: mentorId,
      status: { $in: ["PENDING", "CONFIRMED"] },
    })
      .select("session_times status mentee note")
      .populate("mentee", "full_name email");

    res.status(200).json({
      mentor: {
        id: mentor._id,
        full_name: mentor.full_name,
        job_title: mentor.job_title,
        company: mentor.company,
        price: mentor.price,
      },
      bookedSlots: bookings.map(b => ({
        id: b._id,
        session_times: b.session_times, // Đã có status + meeting_link + mentor_confirmed
        status: b.status,
        note: b.note,
        mentee: b.mentee,
      })),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- GET MENTEE'S BOOKED SLOTS ----------------------
exports.getMenteeBookedSlots = async (req, res) => {
  try {
    const menteeId = req.user.id;

    const bookings = await Booking.find({
      mentee: menteeId,
      status: { $in: ["PENDING", "CONFIRMED", "COMPLETED"] },
    })
      .select("session_times status note mentor price duration sessions")
      .populate("mentor", "full_name job_title company price");

    res.status(200).json({
      mentee: { id: menteeId },
      bookedSlots: bookings.map(b => ({
        id: b._id,
        session_times: b.session_times, // Có status + meeting_link + mentor_confirmed
        status: b.status,
        note: b.note,
        duration: b.duration,
        sessions: b.sessions,
        price: b.price,
        mentor: b.mentor,
      })),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- GET STATUS BOOKING ----------------------
exports.getBookingStatusByMenteeId = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { status, mentorName, page = 1, limit = 10 } = req.query;

    // Xây dựng điều kiện lọc
    const query = { mentee: menteeId };
    if (status) query.status = status;

    // Nếu có tìm theo tên mentor
    const mentorFilter = mentorName
      ? { full_name: { $regex: mentorName, $options: "i" } }
      : {};

    // Lấy tổng số bản ghi để phân trang
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .select(
        "status cancel_reason session_times.status session_times.start_time session_times.end_time session_times.meeting_link price duration sessions createdAt updatedAt"
      )
      .populate({
        path: "mentor",
        match: mentorFilter,
        select: "full_name email phone avatar_url job_title company category skill",
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Loại bỏ booking nào không có mentor (do filter theo mentorName)
    const filteredBookings = bookings.filter((b) => b.mentor);

    if (filteredBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking nào phù hợp",
      });
    }

    // Format dữ liệu
    const formattedBookings = filteredBookings.map((booking) => ({
      bookingId: booking._id,
      mentor: {
        id: booking.mentor._id,
        fullName: booking.mentor.full_name || "Unknown",
        email: booking.mentor.email || "N/A",
        phone: booking.mentor.phone || "N/A",
        avatarUrl: booking.mentor.avatar_url || null,
        jobTitle: booking.mentor.job_title || "N/A",
        company: booking.mentor.company || "N/A",
        category: booking.mentor.category || "N/A",
        skill: booking.mentor.skill || "N/A",
      },
      status: booking.status,
      cancelReason: booking.cancel_reason || null,
      price: booking.price,
      duration: booking.duration,
      sessions: booking.sessions,
      sessionTimes: booking.session_times.map((session) => ({
        startTime: session.start_time,
        endTime: session.end_time,
        status: session.status,
        meetingLink: session.meeting_link || null,
      })),
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      data: formattedBookings,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching booking status:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching booking status",
      error: error.message,
    });
  }
};

// ---------------------- GET LEARNING PROGRESS ----------------------
exports.getLearningProgress = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { status, mentorName, page = 1, limit = 10 } = req.query;

    const query = {
      mentee: menteeId,
      status: { $in: ["PENDING", "CONFIRMED", "COMPLETED"] },
    };
    if (status) query.status = status;

    const mentorFilter = mentorName
      ? { full_name: { $regex: mentorName, $options: "i" } }
      : {};

    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .select("session_times status note mentor price duration sessions createdAt updatedAt")
      .populate({
        path: "mentor",
        match: mentorFilter,
        select: "full_name email job_title company avatar_url category skill",
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const filteredBookings = bookings.filter((b) => b.mentor);

    if (filteredBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking nào phù hợp",
      });
    }

    const learningProgress = filteredBookings.map((booking) => {
      const completedSessions = booking.session_times.filter(
        (s) => s.status === "COMPLETED"
      ).length;

      const progressPercentage =
        booking.sessions > 0
          ? ((completedSessions / booking.sessions) * 100).toFixed(2)
          : 0;

      const sessionDetails = booking.session_times.map((s) => ({
        startTime: s.start_time,
        endTime: s.end_time,
        status: s.status,
        meetingLink: s.meeting_link || null,
        mentorNote: s.note || null,
        mentorConfirmed: s.mentor_confirmed,
      }));

      return {
        bookingId: booking._id,
        mentor: {
          id: booking.mentor._id,
          fullName: booking.mentor.full_name || "N/A",
          email: booking.mentor.email || "N/A",
          jobTitle: booking.mentor.job_title || "N/A",
          company: booking.mentor.company || "N/A",
          avatarUrl: booking.mentor.avatar_url || null,
          category: booking.mentor.category || "N/A",
          skill: booking.mentor.skill || "N/A",
        },
        totalSessions: booking.sessions,
        completedSessions,
        progressPercentage: parseFloat(progressPercentage),
        status: booking.status,
        price: booking.price,
        duration: booking.duration,
        note: booking.note || null,
        sessionDetails,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });

    // Tính tổng quan tiến độ học
    const totalBookings = filteredBookings.length;
    const totalSessions = filteredBookings.reduce((sum, b) => sum + b.sessions, 0);
    const totalCompletedSessions = learningProgress.reduce(
      (sum, b) => sum + b.completedSessions,
      0
    );
    const overallProgressPercentage =
      totalSessions > 0
        ? ((totalCompletedSessions / totalSessions) * 100).toFixed(2)
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        overallProgress: {
          totalBookings,
          totalSessions,
          totalCompletedSessions,
          overallProgressPercentage: parseFloat(overallProgressPercentage),
        },
        bookings: learningProgress,
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching learning progress:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tiến độ học tập",
      error: error.message,
    });
  }
};// ---------------------- GET ALL APPLICATIONS OF A MENTOR ----------------------
exports.getMentorApplications = async (req, res) => {
  try {
    // Nếu mentor đã đăng nhập, lấy id từ token
    const mentorId = req.user?.id || req.params.mentorId;

    // Kiểm tra mentor có tồn tại không
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor không tồn tại" });
    }

    // Lấy toàn bộ booking gửi đến mentor này (mọi trạng thái)
    const bookings = await Booking.find({ mentor: mentorId })
      .populate("mentee", "full_name email avatar_url gpa university major")
      .sort({ createdAt: -1 })
      .lean();

    if (bookings.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    // Chuẩn hóa dữ liệu trả về (cho FE hiển thị list)
    const formatted = bookings.map((b) => ({
      id: b._id,
      program: b.note || "Không có ghi chú",
      status: b.status,
      priority: b.priority || "MEDIUM",
      submittedDate: b.createdAt,
      mentee: {
        id: b.mentee?._id,
        fullName: b.mentee?.full_name || "N/A",
        email: b.mentee?.email || "N/A",
        avatar: b.mentee?.avatar_url || null,
        gpa: b.mentee?.gpa || null,
        university: b.mentee?.university || null,
        major: b.mentee?.major || null,
      },
    }));

    return res.status(200).json({
      success: true,
      total: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Error fetching mentor applications:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy danh sách đơn" });
  }
};

// ---------------------- GET APPLICATION DETAIL BY ID ----------------------
exports.getApplicationDetail = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const booking = await Booking.findById(applicationId)
      .populate("mentor", "full_name email job_title company avatar_url price")
      .populate("mentee", "full_name email avatar_url gpa university major experience motivation")
      .lean();

    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn đăng ký" });
    }

    // Format chi tiết cho đẹp
    const formatted = {
      id: booking._id,
      program: booking.note || "Không có mô tả",
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      price: booking.price,
      duration: booking.duration,
      sessions: booking.sessions,
      sessionTimes: booking.session_times?.map((s) => ({
        startTime: s.start_time,
        endTime: s.end_time,
        status: s.status,
        meetingLink: s.meeting_link || null,
        mentorConfirmed: s.mentor_confirmed,
        note: s.note || "",
      })),
      mentee: {
        id: booking.mentee?._id,
        fullName: booking.mentee?.full_name,
        email: booking.mentee?.email,
        avatar: booking.mentee?.avatar_url,
        gpa: booking.mentee?.gpa,
        university: booking.mentee?.university,
        major: booking.mentee?.major,
        experience: booking.mentee?.experience,
        motivation: booking.mentee?.motivation,
      },
      mentor: {
        id: booking.mentor?._id,
        fullName: booking.mentor?.full_name,
        email: booking.mentor?.email,
        avatar: booking.mentor?.avatar_url,
        jobTitle: booking.mentor?.job_title,
        company: booking.mentor?.company,
        price: booking.mentor?.price,
      },
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };

    return res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error fetching application detail:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy chi tiết đơn" });
  }
};
