const Mentor = require("../models/mentor.model");
const Booking = require("../models/booking.model");

exports.addRating = async (req, res) => {
  try {
    const menteeId = req.user.id; // lấy từ token
    const { mentorId } = req.params;
    const { score, comment } = req.body;

    // ✅ Kiểm tra đã có buổi học hoàn thành với mentor chưa
    const booking = await Booking.findOne({
      mentee: menteeId,
      mentor: mentorId,
      status: "COMPLETED",
    });

    if (!booking) {
      return res.status(400).json({
        message: "Bạn chỉ có thể đánh giá mentor sau khi hoàn thành buổi học với họ.",
      });
    }

    // ✅ Tìm mentor
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Không tìm thấy mentor." });
    }

    // ✅ Kiểm tra đã đánh giá mentor này chưa
    const alreadyRated = mentor.ratings.some(
      (r) => r.mentee.toString() === menteeId
    );
    if (alreadyRated) {
      return res.status(400).json({ message: "Bạn đã đánh giá mentor này rồi." });
    }

    // ✅ Thêm rating
    mentor.ratings.push({ mentee: menteeId, score, comment });

    // ✅ Cập nhật điểm trung bình
    const totalScore = mentor.ratings.reduce((sum, r) => sum + r.score, 0);
    mentor.average_rating = totalScore / mentor.ratings.length;

    await mentor.save();

    return res.status(201).json({
      message: "Đánh giá thành công!",
      rating: { mentee: menteeId, score, comment },
      average_rating: mentor.average_rating,
    });
  } catch (error) {
    console.error("❌ Lỗi khi thêm rating:", error);
    res.status(500).json({ message: "Lỗi server khi thêm đánh giá." });
  }
};