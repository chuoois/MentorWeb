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
      .populate("mentee", "full_name email avatar_url gpa experience motivation job_title")
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
        job_title: b.mentee?.job_title || null,
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
      .populate("mentee", "full_name email avatar_url gpa experience motivation job_title")
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
        job_title: booking.mentee?.job_title,
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
    const { bookingId, sessionIndex } = req.params;
    const { meeting_link, note, markCompleted } = req.body;

    const mentorId = req.user.id;

    // 🔍 Tìm booking thuộc về mentor
    const booking = await Booking.findOne({
      _id: bookingId,
      mentor: mentorId,
    })
      .populate("mentee", "email name")
      .populate("mentor", "name");

    if (!booking)
      return res.status(404).json({ message: "Không tìm thấy booking của mentor này" });

    // 🔍 Kiểm tra session tồn tại
    const session = booking.session_times[sessionIndex];
    if (!session)
      return res.status(404).json({ message: "Không tìm thấy session này" });

    let menteeNeedsNotification = false;

    // ✅ Mentor xác nhận buổi học
    session.mentor_confirmed = true;

    // ✅ Cập nhật link học (nếu có)
    if (meeting_link && meeting_link !== session.meeting_link) {
      session.meeting_link = meeting_link;
      session.status = "PENDING"; // mentee cần xác nhận lại nếu link thay đổi
      session.mentee_confirmed = false;
      menteeNeedsNotification = true;
    }

    // ✅ Cập nhật note (nếu có)
    if (note !== undefined) {
      session.note = note;
    }

    // ✅ Nếu mentor đánh dấu hoàn thành
    if (markCompleted) {
      session.status = "COMPLETED";
      session.completed_at = new Date();
    } else if (session.mentor_confirmed && session.mentee_confirmed) {
      // Nếu cả hai đã xác nhận
      session.status = "CONFIRMED";
    } else if (!session.meeting_link) {
      // Nếu chưa có link
      session.status = "PENDING";
    }

    await booking.save();

    // (Tùy chọn) gửi thông báo cho mentee nếu cần
    // if (menteeNeedsNotification) sendEmailToMentee(booking.mentee.email, ...)

    res.json({
      success: true,
      message: "Mentor đã cập nhật buổi học thành công",
      data: session,
    });
  } catch (error) {
    console.error("Lỗi updateSessionByMentor:", error);
    res.status(500).json({ success: false, message: "Lỗi server" });
  }
};
