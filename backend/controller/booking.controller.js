// controllers/booking.controller.js
// Điều chỉnh path theo project của bạn nếu cần
const Booking = require("../models/booking.model");
const Mentor = require("../models/mentor.model");
const payosSvc = require("../business/payos.service"); // <-- update path nếu khác
const mongoose = require("mongoose");

// ---------------------- CREATE BOOKING ----------------------
exports.createBooking = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { mentorId, session_times, note } = req.body;

    if (!session_times || !Array.isArray(session_times) || session_times.length === 0) {
      return res.status(400).json({ message: "Phải cung cấp ít nhất 1 buổi học với thời gian bắt đầu và kết thúc" });
    }

    const mentor = await Mentor.findOne({ _id: mentorId, status: "ACTIVE" });
    if (!mentor) {
      return res.status(404).json({ message: "Mentor không tồn tại hoặc không hoạt động" });
    }

    // Kiểm tra trùng lịch
    for (const session of session_times) {
      const start = new Date(session.start_time);
      const end = new Date(session.end_time);

      if (end <= start) {
        return res.status(400).json({ message: "Thời gian kết thúc phải sau thời gian bắt đầu" });
      }

      const conflict = await Booking.findOne({
        mentor: mentorId,
        session_times: {
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

      if (conflict) {
        const startVN = start.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
        const endVN = end.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
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

    // Chuẩn hoá session_times
    const formattedSessions = session_times.map(s => ({
      start_time: new Date(s.start_time),
      end_time: new Date(s.end_time),
      meeting_link: s.meeting_link || "",
      status: "UPCOMING",
      mentor_confirmed: false,
      note: "",
    }));

    // Tạo booking
    const newBooking = new Booking({
      mentee: menteeId,
      mentor: mentorId,
      duration: totalDuration,
      sessions,
      session_times: formattedSessions,
      price,
      status: "PENDING",
      paymentStatus: "PENDING",
      paymentforMentor:"PENDING",
      note,
    });
    await newBooking.save();

    // Tạo link thanh toán PayOS
    let paymentLink = null;
    try {
      paymentLink = await payosSvc.createPaymentForBooking(newBooking._id);
      console.log("[PayOS] Payment link created:", newBooking._id);

      // Ghi vào booking (bổ sung cho PayOS)
      if (paymentLink) {
        newBooking.order_code = paymentLink.orderCode;
        newBooking.payment_link_url = paymentLink.checkoutUrl;
        newBooking.payos_status = "PENDING";
        await newBooking.save();
      }
    } catch (err) {
      console.error("[PayOS] Create link failed:", err?.response?.data || err?.message);
      // Không chặn flow — user có thể tạo lại link sau
    }

    const populated = await Booking.findById(newBooking._id)
      .populate("mentee", "full_name email")
      .populate("mentor", "full_name job_title company price");

    return res.status(201).json({
      message: "Tạo booking thành công",
      booking: populated,
      payment: paymentLink
        ? { orderCode: paymentLink.orderCode, checkoutUrl: paymentLink.checkoutUrl }
        : null,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- GET BOOKED SLOTS (MENTOR) ----------------------
exports.getBookedSlots = async (req, res) => {
  try {
    const { mentorId } = req.params;

    const mentor = await Mentor.findOne({ _id: mentorId, status: "ACTIVE"  });
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

exports.getTeachProgress = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { status, menteeName, page = 1, limit = 10 } = req.query;

    // Build query with paymentStatus filter
    const query = {
      mentor: mentorId,
      status: { $in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      paymentStatus: "PAID",
    };
    if (status) query.status = status;

    // Mentee name filter
    const menteeFilter = menteeName
      ? { full_name: { $regex: menteeName, $options: "i" } }
      : {};

    // Get total count for pagination
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .select("session_times status note mentee price duration sessions paymentStatus createdAt updatedAt")
      .populate({
        path: "mentee",
        match: menteeFilter,
        select: "full_name email avatar_url gpa experience motivation",
      })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Filter out bookings without mentee
    const filteredBookings = bookings.filter((b) => b.mentee);

    if (filteredBookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking nào phù hợp",
      });
    }

    // Calculate teaching progress
    const teachingProgress = filteredBookings.map((booking) => {
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
        menteeNote: s.note || null,
        mentorConfirmed: s.mentor_confirmed,
      }));

      return {
        bookingId: booking._id,
        mentee: {
          id: booking.mentee._id,
          fullName: booking.mentee.full_name || "N/A",
          email: booking.mentee.email || "N/A",
          avatarUrl: booking.mentee.avatar_url || null,
          gpa: booking.mentee.gpa || null,
          experience: booking.mentee.experience || "N/A",
          motivation: booking.mentee.motivation || "N/A",
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

    // Tổng quan tiến độ giảng dạy
    const totalBookings = filteredBookings.length;
    const totalSessions = filteredBookings.reduce((sum, b) => sum + b.sessions, 0);
    const totalCompletedSessions = teachingProgress.reduce(
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
        bookings: teachingProgress,
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching teaching progress:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy tiến độ giảng dạy",
      error: error.message,
    });
  }
};

// ---------------------- CANCEL BOOKING ----------------------
exports.cancelBooking = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { id } = req.params;

    const booking = await Booking.findOne({ payment_link_id: id, mentee: menteeId });
    if (!booking) return res.status(404).json({ message: "Booking không tồn tại" });

    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Booking đã thanh toán — cần quy trình hoàn tiền riêng" });
    }

    if (booking.order_code) {
      try {
        await payosSvc.cancelPaymentLink(booking.order_code, "User cancelled booking");
      } catch (err) {
        console.warn("[PayOS] Cancel link warning:", err?.message);
      }
    }

    booking.status = "CANCELLED";
    booking.paymentStatus = "FAILED";
    booking.payos_status = "CANCELLED";
    await booking.save();

    return res.json({ message: "Đã hủy booking", bookingId: booking._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- RECREATE PAYMENT LINK ----------------------
exports.recreatePaymentLink = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { id } = req.params;

    const booking = await Booking.findOne({ _id: id, mentee: menteeId });
    if (!booking) return res.status(404).json({ message: "Booking không tồn tại" });
    if (booking.paymentStatus === "PAID") {
      return res.status(400).json({ message: "Booking đã thanh toán" });
    }

    const link = await payosSvc.createPaymentForBooking(booking._id, { forceNew: true });

    if (link) {
      booking.order_code = link.orderCode;
      booking.payment_link_url = link.checkoutUrl;
      booking.payos_status = "PENDING";
      await booking.save();
    }

    return res.json({ ok: true, ...link });
  } catch (err) {
    console.error("Recreate PayOS link error:", err?.response?.data || err);
    return res.status(400).json({
      message: err?.message || "Create payment link failed",
      payos: err?.response?.data || undefined,
    });
  }
};

exports.confirmSession = async (req, res) => {
  try {
    const { bookingId, sessionIndex } = req.params;

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ message: "Booking không tồn tại" });
    if (sessionIndex >= booking.session_times.length)
      return res.status(400).json({ message: "Session không hợp lệ" });

    const session = booking.session_times[sessionIndex];

    // ✅ Chỉ cho mentee xác nhận
    session.mentee_confirmed = true;

    // ✅ Nếu cả hai bên đã xác nhận → CONFIRMED
    if (session.mentee_confirmed) {
      session.status = "CONFIRMED";
    } else {
      session.status = "PENDING";
    }

    await booking.save();

    res.json({
      message: "Mentee đã xác nhận buổi học thành công",
      booking,
    });
  } catch (error) {
    console.error("Lỗi confirmSession:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.cancelSession = async (req, res) => {
  const { bookingId, sessionIndex } = req.params;
  const { role } = req.body;

  const booking = await Booking.findById(bookingId);
  if (!booking) return res.status(404).json({ message: "Booking không tồn tại" });
  if (sessionIndex >= booking.session_times.length)
    return res.status(400).json({ message: "Session không hợp lệ" });

  const session = booking.session_times[sessionIndex];
  session.status = "CANCELLED";

  if (role === "mentee") {
    session.mentee_confirmed = false;
  } else if (role === "mentor") {
    session.mentor_confirmed = false;
  } else {
    return res.status(400).json({ message: "Vai trò không hợp lệ" });
  }

  await booking.save();
  res.json({ message: "Đã hủy buổi học", booking });
};

exports.confirmSessionByMentor = async (req, res) => {
  try {
    const { bookingId, sessionIndex } = req.params;
    const mentorId = req.user.id;

    // 🔍 Tìm booking thuộc về mentor
    const booking = await Booking.findOne({ _id: bookingId, mentor: mentorId });
    if (!booking)
      return res.status(404).json({ message: "Không tìm thấy booking của mentor này" });

    if (sessionIndex >= booking.session_times.length)
      return res.status(400).json({ message: "Session không hợp lệ" });

    const session = booking.session_times[sessionIndex];

    // ✅ Mentor xác nhận
    session.mentor_confirmed = true;

    // ✅ Nếu cả hai bên đã xác nhận → CONFIRMED
    if (session.mentor_confirmed) {
      session.status = "CONFIRMED";
    } else {
      session.status = "PENDING";
    }

    await booking.save();

    res.json({
      success: true,
      message: "Mentor đã xác nhận buổi học thành công",
      data: session,
    });
  } catch (error) {
    console.error("Lỗi confirmSessionByMentor:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.cancelSessionByMentor = async (req, res) => {
  try {
    const { bookingId, sessionIndex } = req.params;
    const mentorId = req.user.id;

    const booking = await Booking.findOne({ _id: bookingId, mentor: mentorId });
    if (!booking)
      return res.status(404).json({ message: "Không tìm thấy booking của mentor này" });

    if (sessionIndex >= booking.session_times.length)
      return res.status(400).json({ message: "Session không hợp lệ" });

    const session = booking.session_times[sessionIndex];

    // ✅ Cập nhật trạng thái
    session.status = "CANCELLED";
    session.mentor_confirmed = false;

    await booking.save();

    res.json({
      success: true,
      message: "Mentor đã hủy buổi học thành công",
      data: session,
    });
  } catch (error) {
    console.error("Lỗi cancelSessionByMentor:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateSessionLinkByMentor = async (req, res) => {
  try {
    const { bookingId, sessionIndex } = req.params;
    const { meeting_link } = req.body;
    const mentorId = req.user.id; // lấy từ middleware xác thực JWT

    // 🔍 Tìm booking thuộc về mentor
    const booking = await Booking.findOne({
      _id: bookingId,
      mentor: mentorId,
    });

    if (!booking)
      return res.status(404).json({ message: "Không tìm thấy booking của mentor này" });

    // 🔍 Kiểm tra session tồn tại
    const session = booking.session_times[sessionIndex];
    if (!session)
      return res.status(404).json({ message: "Không tìm thấy session này" });

    // ✅ Cập nhật meeting link
    if (!meeting_link)
      return res.status(400).json({ message: "Thiếu meeting_link trong body" });

    session.meeting_link = meeting_link;

    await booking.save();

    // (Tuỳ chọn) gửi mail hoặc thông báo cho mentee
    // sendEmailToMentee(booking.mentee.email, ...)

    res.json({
      success: true,
      message: "Mentor đã cập nhật link buổi học thành công",
      data: {
        bookingId: booking._id,
        sessionIndex,
        meeting_link: session.meeting_link,
        status: session.status,
      },
    });
  } catch (error) {
    console.error("Lỗi updateSessionLinkByMentor:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// ---------------------- GET TRANSACTION HISTORY ----------------------
exports.getTransactionHistory = async (req, res) => {
  try {
    const menteeId = req.user.id;
    const { status, paymentStatus, page = 1, limit = 10, startDate, endDate } = req.query;

    // Xây dựng điều kiện lọc
    const query = { mentee: menteeId };
    
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    // Lọc theo ngày
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Lấy tổng số bản ghi để phân trang
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .select("status paymentStatus price duration sessions order_code payment_at payment_meta currency createdAt updatedAt")
      .populate("mentor", "full_name job_title company avatar_url")
      .sort({ createdAt: -1 }) // Sắp xếp theo ngày tạo mới nhất
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Format dữ liệu lịch sử giao dịch
    const transactionHistory = bookings.map((booking) => {
      const mentor = booking.mentor || {};
      
      return {
        transactionId: booking._id,
        orderCode: booking.order_code,
        mentor: {
          id: mentor._id,
          fullName: mentor.full_name || "N/A",
          jobTitle: mentor.job_title || "N/A",
          company: mentor.company || "N/A",
          avatarUrl: mentor.avatar_url || null,
        },
        amount: booking.price,
        duration: booking.duration,
        sessions: booking.sessions,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        currency: booking.currency || "VND",
        paymentAt: booking.payment_at,
        paymentMeta: booking.payment_meta,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      };
    });

    // Tính tổng thống kê
    const totalAmount = bookings.reduce((sum, booking) => {
      return booking.paymentStatus === "PAID" ? sum + booking.price : sum;
    }, 0);

    const paidTransactions = bookings.filter(b => b.paymentStatus === "PAID").length;
    const pendingTransactions = bookings.filter(b => b.paymentStatus === "PENDING").length;
    const failedTransactions = bookings.filter(b => b.paymentStatus === "FAILED").length;
    const cancelledTransactions = bookings.filter(b => b.paymentStatus === "CANCELLED").length;

    return res.status(200).json({
      success: true,
      data: {
        transactions: transactionHistory,
        summary: {
          totalTransactions: total,
          totalAmount,
          paidTransactions,
          pendingTransactions,
          failedTransactions,
          cancelledTransactions,
        }
      },
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching transaction history:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi server khi lấy lịch sử giao dịch",
      error: error.message,
    });
  }
};

exports.getMentorWeeklyRevenue = async (req, res) => {
  try {
    const { mentorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: "Mentor ID không hợp lệ" });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Lọc booking đủ điều kiện thanh toán
    const bookings = await Booking.find({
      mentor: mentorId,
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentforMentor: "PENDING",
      "session_times.mentor_confirmed": true,
      "session_times.mentee_confirmed": true,
      payment_at: { $gte: sevenDaysAgo },
    })
      .populate("mentee", "full_name email")
      .populate("mentor", "full_name email")
      .sort({ payment_at: -1 })
      .lean();

    if (!bookings.length) {
      return res.json({
        message: "Không có booking nào đủ điều kiện thanh toán tuần này.",
        totalRevenue7Days: 0,
        bookings: [],
      });
    }

    // Tổng doanh thu 7 ngày
    const totalRevenue7Days = bookings.reduce(
      (sum, b) => sum + (b.price || 0),
      0
    );

    res.json({
      mentorId,
      mentorName: bookings[0].mentor?.full_name,
      totalBookings: bookings.length,
      totalRevenue7Days,
      bookings: bookings.map((b) => ({
        booking_id: b._id,
        mentee_name: b.mentee?.full_name,
        price: b.price,
        payment_at: b.payment_at,
        status: b.status,
      })),
    });
  } catch (error) {
    console.error("Lỗi getMentorWeeklyRevenue:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

exports.markMentorWeeklyPaid = async (req, res) => {
  try {
    const { mentorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
      return res.status(400).json({ message: "Mentor ID không hợp lệ" });
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const unpaidBookings = await Booking.find({
      mentor: mentorId,
      status: "COMPLETED",
      paymentStatus: "PAID",
      paymentforMentor: "PENDING",
      "session_times.mentor_confirmed": true,
      "session_times.mentee_confirmed": true,
      payment_at: { $gte: sevenDaysAgo },
    });

    if (!unpaidBookings.length) {
      return res.json({ message: "Không có booking nào cần thanh toán tuần này." });
    }

    // Đánh dấu đã thanh toán cho mentor
    await Booking.updateMany(
      {
        mentor: mentorId,
        status: "COMPLETED",
        paymentStatus: "PAID",
        paymentforMentor: "PENDING",
        "session_times.mentor_confirmed": true,
        "session_times.mentee_confirmed": true,
        payment_at: { $gte: sevenDaysAgo },
      },
      { $set: { paymentforMentor: "PAID" } }
    );

    const totalPaid = unpaidBookings.reduce((sum, b) => sum + (b.price || 0), 0);

    res.json({
      message: "Đã thanh toán cho mentor trong chu kỳ 7 ngày.",
      totalBookingsPaid: unpaidBookings.length,
      totalAmountPaid: totalPaid,
      paidAt: new Date(),
    });
  } catch (error) {
    console.error("Lỗi markMentorWeeklyPaid:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};
