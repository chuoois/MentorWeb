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

    // 🔹 Chỉ lấy các booking có paymentStatus = "PAID"
    const bookings = await Booking.find({ mentor: mentorId, paymentStatus: "PAID" })
      .populate("mentee", "full_name email avatar_url gpa experience motivation")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = bookings.map((b) => ({
      id: b._id,
      program: b.note || "Không có ghi chú",
      status: b.status,
      paymentStatus: b.paymentStatus, // có thể thêm nếu muốn hiển thị
      submittedDate: b.createdAt,
      mentee: {
        id: b.mentee?._id || null,
        fullName: b.mentee?.full_name || "N/A",
        email: b.mentee?.email || "N/A",
        avatar: b.mentee?.avatar_url || null,
        gpa: b.mentee?.gpa || null,
        experience: b.mentee?.experience || null,
        motivation: b.mentee?.motivation || null,
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


exports.getMentorBookedSlots = async (req, res) => {
  try {
    const mentorId = req.user.id;

    const bookings = await Booking.find({
      mentor: mentorId,
      status: { $in: ["PENDING", "CONFIRMED", "COMPLETED"] },
      paymentStatus: "PAID",
    })
      .select("session_times status note mentee price duration sessions paymentStatus")
      .populate("mentee", "full_name email")
      .lean();

    res.status(200).json({
      mentor: { id: mentorId },
      bookedSlots: bookings.map(b => ({
        id: b._id,
        session_times: b.session_times,
        status: b.status,
        note: b.note,
        duration: b.duration,
        sessions: b.sessions,
        price: b.price,
        paymentStatus: b.paymentStatus,
        mentee: b.mentee,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
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

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId, status, cancel_reason } = req.body; 
    console.log(req.body);

    const mentorId = req.user.id;
    const booking = await Booking.findOne({ _id: applicationId, mentor: mentorId });
    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn của mentor này" });
    }

    if (!["CONFIRMED", "CANCELLED"].includes(status)) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    booking.status = status;
    if (status === "CANCELLED") {
      booking.cancel_reason = cancel_reason || "Mentor từ chối không ghi lý do";
    }

    await booking.save();
    res.json({
      success: true,
      message: `Cập nhật trạng thái đơn thành công (${status})`,
      data: booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Lỗi server khi cập nhật trạng thái đơn" });
  }
};

exports.updateSessionByMentor = async (req, res) => {
  try {
    // ✅ Lấy applicationId từ PARAMS chứ không phải body
    const { applicationId } = req.params;
    const { sessionIndex, meeting_link, note, markCompleted } = req.body;

    const mentorId = req.user.id;
    const booking = await Booking.findOne({ _id: applicationId, mentor: mentorId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy booking của mentor này",
      });
    }

    const session = booking.session_times[sessionIndex];
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy session này",
      });
    }

    // ✅ Cập nhật dữ liệu session
    if (meeting_link !== undefined) session.meeting_link = meeting_link;
    if (note !== undefined) session.note = note;
    if (markCompleted) {
      session.status = "COMPLETED";
      session.mentor_confirmed = true;
    }

    await booking.save();

    res.json({
      success: true,
      message: "Cập nhật session thành công",
      data: session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Lỗi server khi cập nhật session",
    });
  }
};
