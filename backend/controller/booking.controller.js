// controllers/booking.controller.js
// Điều chỉnh path theo project của bạn nếu cần
const Booking = require("../models/booking.model");
const Mentor = require("../models/mentor.model");
const payosSvc = require("../business/payos.service"); // <-- update path nếu khác

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

    // Kiểm tra trùng lịch cho từng buổi (CHỈ theo mentor này)
    for (const session of session_times) {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);

      if (end <= start) {
        return res.status(400).json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu của từng buổi" });
      }

      const conflictingBooking = await Booking.findOne({
        mentor: mentorId, // ✅ chỉ kiểm tra lịch của đúng mentor
        session_times: {
          $elemMatch: {
            $or: [
              { start_time: { $lte: start }, end_time: { $gt: start } },
              { start_time: { $lt: end },   end_time: { $gte: end }  },
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

    // Khởi tạo session_times
    const formattedSessions = session_times.map(s => ({
      start_time: new Date(s.start_time),
      end_time: new Date(s.end_time),
      meeting_link: s.meeting_link || "",
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

    // Tạo link thanh toán PayOS cho booking
    let paymentLink = null;
    try {
      paymentLink = await payosSvc.createPaymentForBooking(newBooking._id);
      // createPaymentForBooking sẽ ghi order_code, payment_link_url vào booking
    } catch (e) {
      console.error("Create PayOS link failed:", e?.message || e);
      // Không chặn flow — cho phép user tạo link lại sau qua API recreatePaymentLink
    }

    const populatedBooking = await Booking.findById(newBooking._id)
      .populate("mentee", "full_name email")
      .populate("mentor", "full_name job_title company price");

    return res.status(201).json({
      message: "Tạo booking thành công",
      booking: populatedBooking,
      payment: paymentLink
        ? { orderCode: paymentLink.orderCode, checkoutUrl: paymentLink.checkoutUrl }
        : null,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
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

    return res.status(200).json({
      mentor: {
        id: mentor._id,
        full_name: mentor.full_name,
        job_title: mentor.job_title,
        company: mentor.company,
        price: mentor.price,
      },
      bookedSlots: bookings.map(b => ({
        id: b._id,
        session_times: b.session_times,
        status: b.status,
        note: b.note,
        mentee: b.mentee,
      })),
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- GET MENTEE'S BOOKED SLOTS ----------------------
exports.getMenteeBookedSlots = async (req, res) => {
  try {
    const menteeId = req.user.id;

    const bookings = await Booking.find({
      mentee: menteeId,
      status: { $in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      paymentStatus: "PAID",
    })
      .select("session_times status note mentor price duration sessions paymentStatus")
      .populate("mentor", "full_name job_title company price")
      .lean();

    res.status(200).json({
      mentee: { id: menteeId },
      bookedSlots: bookings.map(b => ({
        id: b._id,
        session_times: b.session_times,
        status: b.status,
        note: b.note,
        duration: b.duration,
        sessions: b.sessions,
        price: b.price,
        paymentStatus: b.paymentStatus,
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
        "status cancel_reason session_times.status session_times.start_time session_times.end_time session_times.meeting_link price duration sessions paymentStatus createdAt updatedAt"
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
      paymentStatus: booking.paymentStatus || "N/A",
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

    // Build query with paymentStatus filter
    const query = {
      mentee: menteeId,
      status: { $in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      paymentStatus: "PAID",
    };
    if (status) query.status = status;

    // Mentor name filter
    const mentorFilter = mentorName
      ? { full_name: { $regex: mentorName, $options: "i" } }
      : {};

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .select("session_times status note mentor price duration sessions paymentStatus createdAt updatedAt")
      .populate({
        path: "mentor",
        match: mentorFilter,
        select: "full_name email job_title company avatar_url category skill",
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Filter out bookings without a mentor
    const filteredBookings = bookings.filter((b) => b.mentor);

    if (filteredBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking nào phù hợp",
      });
    }

    // Calculate learning progress
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
        paymentStatus: booking.paymentStatus || "N/A",
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

};

// ---------------------- CANCEL BOOKING (Hủy & hủy link PayOS nếu chưa thanh toán) ----------------------
exports.cancelBooking = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { id } = req.params; // bookingId
    const booking = await Booking.findOne({ _id: id, mentee: menteeId });

    if (!booking) return res.status(404).json({ message: "Booking không tồn tại" });
    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Booking đã thanh toán — cần quy trình hoàn tiền riêng" });
    }

    // Hủy link thanh toán nếu đã tạo
    if (booking.order_code) {
      try {
        await payosSvc.cancelPaymentLink(booking.order_code, "User cancelled booking");
      } catch (e) {
        console.warn("Cancel PayOS link warning:", e?.message || e);
      }
    }

    booking.status = "CANCELLED";
    booking.paymentStatus = "FAILED";
    await booking.save();

    return res.json({ message: "Đã hủy booking", bookingId: booking._id });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- RECREATE PAYMENT LINK (tạo lại link nếu mất tab/chưa thanh toán) ----------------------
// controller/booking.controller.js
exports.recreatePaymentLink = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { id } = req.params; // bookingId

    const booking = await Booking.findOne({ _id: id, mentee: menteeId });
    if (!booking) return res.status(404).json({ message: "Booking không tồn tại" });
    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Booking đã thanh toán" });
    }

    // ép tạo orderCode mới để tránh trùng
    const link = await payosSvc.createPaymentForBooking(booking._id, { forceNew: true });
    return res.json({ ok: true, ...link });
  } catch (e) {
    // LOG chi tiết lên console
    console.error("recreatePaymentLink error:", e?.response?.data || e);
    // trả lỗi rõ ràng cho Postman
    return res.status(400).json({
      message: e?.message || 'Create payment link failed',
      payos: e?.response?.data || undefined
    });
  }
};
