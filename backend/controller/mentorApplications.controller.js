const Booking = require("../models/booking.model");
const Mentor = require("../models/mentor.model");

// ---------------------- GET ALL APPLICATIONS OF A MENTOR ----------------------
exports.getMentorApplications = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor không tồn tại" });
    }

    const bookings = await Booking.find({ mentor: mentorId })
      .populate("mentee", "full_name email avatar_url gpa experience motivation")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = bookings.map((b) => ({
      id: b._id,
      program: b.note || "Không có ghi chú",
      status: b.status,
      submittedDate: b.createdAt,
      mentee: {
        id: b.mentee?._id || null,
        fullName: b.mentee?.full_name || "N/A",
        email: b.mentee?.email || "N/A",
        avatar: b.mentee?.avatar_url || null,
        gpa: b.mentee?.gpa || null,
        experience: b.mentee?.experience || null,
        motivation: b.mentee?.motivation || null
      },
    }));

    return res.status(200).json({
      success: true,
      total: formatted.length,
      data: formatted,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn:", error);
    res.status(500).json({ success: false, message: "Lỗi server khi lấy danh sách đơn" });
  }
};

// ---------------------- GET APPLICATION DETAIL BY ID ----------------------
exports.getApplicationDetail = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const booking = await Booking.findById(applicationId)
      .populate("mentor", "full_name email job_title company avatar_url price")
      .populate("mentee", "full_name email avatar_url gpa experience motivation")
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

// Mentor xác nhận hoặc từ chối đơn đăng ký
// PATCH /api/mentors/applications/:bookingId/status
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status, cancel_reason } = req.body; // status = CONFIRMED | CANCELLED

    // Chỉ cho phép mentor của đơn đó chỉnh sửa
    const mentorId = req.user.id;
    const booking = await Booking.findOne({ _id: bookingId, mentor: mentorId });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn của mentor này" });
    }

    if (!["CONFIRMED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    booking.status = status;
    if (status === "CANCELLED") booking.cancel_reason = cancel_reason || "Mentor từ chối không ghi lý do";
    await booking.save();

    res.json({ success: true, message: `Cập nhật trạng thái đơn thành công (${status})`, data: booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật trạng thái đơn" });
  }
};


// Thêm link buổi học (meeting_link)
// Thêm note nhận xét
// Tick xác nhận buổi học đã hoàn thành (mentor_confirmed = true, status = "COMPLETED"
// PATCH /api/bookings/:bookingId/session/:sessionIndex
exports.updateSessionByMentor = async (req, res) => {
  try {
    const { bookingId, sessionIndex } = req.params;
    const { meeting_link, note, markCompleted } = req.body; // markCompleted = true/false
    const mentorId = req.user.id;

    const booking = await Booking.findOne({ _id: bookingId, mentor: mentorId });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy booking của mentor này" });
    }

    const session = booking.session_times[sessionIndex];
    if (!session) {
      return res.status(404).json({ success: false, message: "Không tìm thấy session này" });
    }

    if (meeting_link !== undefined) session.meeting_link = meeting_link;
    if (note !== undefined) session.note = note;
    if (markCompleted) {
      session.status = "COMPLETED";
      session.mentor_confirmed = true;
    }

    await booking.save();
    res.json({ success: true, message: "Cập nhật session thành công", data: session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật session" });
  }
};
