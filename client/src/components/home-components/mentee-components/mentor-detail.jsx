import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import {
  Star,
  MapPin,
  Clock,
  MessageCircle,
  ArrowLeft,
  CheckCircle,
  Linkedin,
  Globe,
  Calendar,
  X,
  Plus,
  TrendingUp,
  Award,
  Users,
  DollarSign,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addHours, startOfDay, addDays } from "date-fns";
import { vi } from "date-fns/locale"; // Vietnamese locale
import MentorService from "@/services/mentor.service";
import BookingService from "@/services/booking.service";
import CommentService from "@/services/comment.service";
import { Skeleton } from "@/components/ui/skeleton";

// Skeleton loading component
const MentorSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
    <div className="lg:col-span-2 space-y-6">
      <Card>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <Skeleton className="w-32 h-32 rounded-full" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-8">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-8">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-8">
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <Card className="lg:col-span-1">
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  </div>
);

export const MentorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 5)); // Default to +5 days
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [note, setNote] = useState("");
  const [sessionDuration, setSessionDuration] = useState(1);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const durationOptions = [1, 1.5, 2, 2.5, 3];

  useEffect(() => {
    const fetchMentorAndBookings = async () => {
      try {
        setLoading(true);
        setCommentsLoading(true);
        const [resMentor, resBookings, resComments] = await Promise.all([
          MentorService.getMentorByID(id),
          BookingService.getBookedSlots(id),
          CommentService.getCommentsByMentor(id),
        ]);
        setMentor(resMentor.mentor);
        setBookedSlots(resBookings.bookedSlots || []);
        setComments(resComments.comments || []);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu mentor, lịch đặt, hoặc bình luận");
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };
    fetchMentorAndBookings();
  }, [id]);

  const generateAvailableSlots = useCallback(
    (date) => {
      const slots = [];
      const startHour = 9;
      const endHour = 17;
      const interval = 0.5;

      for (let hour = startHour; hour <= endHour - sessionDuration; hour += interval) {
        const startTime = new Date(startOfDay(date).setHours(hour, 0, 0));
        const endTime = addHours(startTime, sessionDuration);

        const isBooked = bookedSlots.some((booking) =>
          booking.session_times.some((slot) => {
            const bookedStart = new Date(slot.start_time);
            const bookedEnd = new Date(slot.end_time);
            return (
              (startTime >= bookedStart && startTime < bookedEnd) ||
              (endTime > bookedStart && endTime <= bookedEnd) ||
              (startTime <= bookedStart && endTime >= bookedEnd)
            );
          })
        );

        if (!isBooked && endTime.getHours() <= endHour) {
          slots.push({ start: startTime, end: endTime });
        }
      }
      return slots;
    },
    [sessionDuration, bookedSlots]
  );

  const availableSlots = generateAvailableSlots(selectedDate);

  const handleSlotSelect = (slot) => {
    setSelectedSlots((prev) => {
      const exists = prev.some(
        (s) => s.start.getTime() === slot.start.getTime()
      );
      if (exists) {
        return prev.filter((s) => s.start.getTime() !== slot.start.getTime());
      }
      return [...prev, slot];
    });
  };

  const handleAddDate = () => {
    const newDate = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000);
    const minDate = addDays(new Date(), 5);
    setSelectedDate(newDate >= minDate ? newDate : minDate);
    setSelectedSlots([]); // Clear slots when adding a new date
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const minAllowedDate = addDays(new Date(), 5);
    if (selectedDate < startOfDay(minAllowedDate)) {
      toast.error("Ngày đặt lịch phải từ 5 ngày sau trở đi!");
      return;
    }
    if (selectedSlots.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khung giờ");
      return;
    }

    // Format session_times for backend
    const sessionTimes = selectedSlots.map((slot) => ({
      start_time: slot.start.toISOString(),
      end_time: slot.end.toISOString(),
    }));

    // Confirmation prompt
    const sessionTimesText = selectedSlots
      .map(
        (slot) =>
          `từ ${format(slot.start, "HH:mm")} đến ${format(
            slot.end,
            "HH:mm"
          )} ngày ${format(slot.start, "dd/MM/yyyy")}`
      )
      .join(", ");
    const confirm = window.confirm(
      `Bạn có chắc muốn đặt ${selectedSlots.length} buổi mentoring với ${mentor.full_name
      } vào các khung giờ: ${sessionTimesText}?`
    );
    if (!confirm) return;

    setLoading(true);
    try {
      const bookingData = {
        mentorId: id,
        session_times: sessionTimes,
        note,
      };
      const response = await BookingService.createBooking(bookingData);
      toast.success("Đặt lịch thành công!");
      navigate("/mentee/schedule");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Lỗi khi đặt lịch";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <MentorSkeleton />
        </div>
      </main>
    );
  }

  if (!mentor) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy mentor
          </h1>
          <Link to="/">
            <Button className="bg-[#2C3E50] hover:bg-[#1a252f] text-white">
              Quay về trang chủ
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  // Calculate total duration and price
  const totalDuration = selectedSlots.length * sessionDuration;
  const calculatedPrice = (mentor.price * totalDuration).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  // Sort comments by creation date (newest first)
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/listmentor"
          className="inline-flex items-center gap-2 text-[#333333] dark:text-gray-300 hover:text-[#2C3E50] dark:hover:text-[#F9C5D5] mb-6 transition-all duration-200 font-medium group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Quay lại
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#F9C5D5]"></div>
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative">
                    <Avatar className="w-28 h-28 sm:w-36 sm:h-36 ring-4 ring-[#F9C5D5]/30">
                      <AvatarImage
                        src={mentor.avatar_url || "/placeholder.svg"}
                        alt={mentor.full_name}
                      />
                      <AvatarFallback className="text-2xl bg-[#F9C5D5] text-[#2C3E50]">
                        {mentor.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3E50] dark:text-white mb-2">
                          {mentor.full_name}
                        </h1>
                        <p className="text-lg font-semibold text-[#333333] dark:text-gray-300 mb-1">
                          {mentor.job_title}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                          <Award className="h-4 w-4 text-[#F9C5D5]" />
                          {mentor.company} · {mentor.current_position}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4 p-4 bg-gradient-to-r from-pink-50 to-white rounded-xl border border-[#F9C5D5]/20">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#F9C5D5]/20 p-2 rounded-full">
                          <Star className="h-4 w-4 fill-[#F9C5D5] text-[#F9C5D5]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2C3E50] dark:text-white">
                            {mentor.rating || 0}
                          </p>
                          <p className="text-xs text-gray-600">Rating</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="bg-[#2C3E50]/10 p-2 rounded-full">
                          <Users className="h-4 w-4 text-[#2C3E50]" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#2C3E50] dark:text-white">
                            {mentor.sessions || 0}
                          </p>
                          <p className="text-xs text-gray-600">Sessions</p>
                        </div>
                      </div>
                      {mentor.location && (
                        <div className="flex items-center gap-2">
                          <div className="bg-[#F9C5D5]/20 p-2 rounded-full">
                            <MapPin className="h-4 w-4 text-[#2C3E50]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#2C3E50] dark:text-white">
                              {mentor.location}
                            </p>
                            <p className="text-xs text-gray-600">Location</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(mentor.category || "").split(",").map((category, idx) => (
                        <Badge
                          key={idx}
                          className="bg-[#F9C5D5] text-[#2C3E50] border-0 px-3 py-1 hover:shadow-md transition-shadow font-medium"
                        >
                          {category.trim()}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        size="sm"
                        className="bg-[#2C3E50] hover:bg-[#1a252f] text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Nhắn tin
                      </Button>
                      {mentor.linkedin_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          as="a"
                          href={mentor.linkedin_url}
                          target="_blank"
                          className="border-[#F9C5D5] text-[#2C3E50] hover:bg-[#F9C5D5]/10"
                        >
                          <Linkedin className="h-4 w-4 mr-2" />
                          LinkedIn
                        </Button>
                      )}
                      {mentor.personal_link_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          as="a"
                          href={mentor.personal_link_url}
                          target="_blank"
                          className="border-[#F9C5D5] text-[#2C3E50] hover:bg-[#F9C5D5]/10"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Website
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 bg-white">
              <CardHeader className="border-b border-[#F9C5D5]/20">
                <CardTitle className="text-xl flex items-center gap-2 text-[#2C3E50]">
                  <TrendingUp className="h-5 w-5 text-[#F9C5D5]" />
                  Giới thiệu
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-[#333333] dark:text-gray-300 leading-relaxed">
                  {mentor.bio}
                </p>
              </CardContent>
            </Card>

            {/* Skills */}
            {mentor.skill && (
              <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 bg-white">
                <CardHeader className="border-b border-[#F9C5D5]/20">
                  <CardTitle className="text-xl flex items-center gap-2 text-[#2C3E50]">
                    <Award className="h-5 w-5 text-[#F9C5D5]" />
                    Kỹ năng chuyên môn
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-2">
                    {(mentor.skill || "").split(",").map((skill, idx) => (
                      <Badge
                        key={idx}
                        className="bg-white border-2 border-[#F9C5D5] text-[#2C3E50] px-4 py-2 text-sm hover:bg-[#F9C5D5] hover:text-white transition-all font-medium"
                      >
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card className="shadow-lg hover:shadow-xl transition-shadow border-0 bg-white">
              <CardHeader className="border-b border-[#F9C5D5]/20">
                <CardTitle className="text-xl flex items-center gap-2 text-[#2C3E50]">
                  <MessageCircle className="h-5 w-5 text-[#F9C5D5]" />
                  Bình luận ({sortedComments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {commentsLoading ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Skeleton className="w-12 h-12 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  </div>
                ) : sortedComments.length > 0 ? (
                  <div className="space-y-6 max-h-96 overflow-y-auto">
                    {sortedComments.map((comment, idx) => (
                      <div key={comment._id || idx} className="flex gap-4">
                        <Avatar className="w-12 h-12 flex-shrink-0">
                          <AvatarImage
                            src={comment.mentee?.avatar_url || "/placeholder.svg"}
                            alt={comment.mentee?.full_name}
                          />
                          <AvatarFallback className="bg-[#F9C5D5] text-[#2C3E50]">
                            {comment.mentee?.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-[#2C3E50]">
                              {comment.mentee?.full_name || "Người dùng"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {format(new Date(comment.createdAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < comment.rating
                                  ? "fill-[#F9C5D5] text-[#F9C5D5]"
                                  : "text-gray-300"
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-[#333333] dark:text-gray-300 text-sm leading-relaxed">
                            {comment.content}
                          </p>
                          {comment.booking && (
                            <p className="text-xs text-gray-400 mt-1">
                              Từ buổi booking: {comment.booking.sessions} sessions
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">
                    Chưa có bình luận nào cho mentor này.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Booking */}
          <div>
            <Card className="sticky top-8 shadow-xl border-0 overflow-hidden bg-white">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#F9C5D5]"></div>
              <CardHeader className="bg-[#2C3E50] text-white">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Đặt lịch mentoring
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="bg-gradient-to-br from-pink-50 to-white p-5 rounded-xl border-2 border-[#F9C5D5]">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-[#333333]">
                      Tổng chi phí
                    </span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-[#F9C5D5]" />
                      <span className="text-2xl font-bold text-[#2C3E50]">
                        {selectedSlots.length > 0
                          ? calculatedPrice
                          : `${mentor.price?.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}/giờ`}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    {sessionDuration} giờ × {selectedSlots.length} buổi
                  </p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#2C3E50] mb-3">
                    <Clock className="h-4 w-4 text-[#F9C5D5]" />
                    Thời lượng mỗi buổi
                  </label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => {
                      setSessionDuration(parseFloat(e.target.value));
                      setSelectedSlots([]); // Clear slots when duration changes
                    }}
                    className="w-full p-3 border-2 border-[#F9C5D5]/30 rounded-lg bg-white text-[#333333] focus:border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5]/20 transition-all"
                  >
                    {durationOptions.map((d) => (
                      <option key={d} value={d}>
                        {d} giờ
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#2C3E50] mb-3">
                    <Calendar className="h-4 w-4 text-[#F9C5D5]" />
                    Chọn ngày
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Lịch chỉ có thể đặt từ ngày {format(addDays(new Date(), 5), "dd/MM/yyyy")} trở đi.
                  </p>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      setSelectedDate(date);
                      setSelectedSlots([]); // Clear slots when date changes
                    }}
                    minDate={addDays(new Date(), 5)}
                    dateFormat="dd/MM/yyyy"
                    locale={vi}
                    className="w-full p-3 border-2 border-[#F9C5D5]/30 rounded-lg bg-white text-[#333333] focus:border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5]/20 transition-all"
                  />
                  <Button
                    onClick={handleAddDate}
                    variant="outline"
                    className="mt-3 w-full border-2 border-dashed border-[#F9C5D5] text-[#2C3E50] hover:bg-[#F9C5D5]/10 transition-all"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm ngày khác
                  </Button>
                </div>

                <div>
                  <label className="flex items-center justify-between text-sm font-semibold text-[#2C3E50] mb-3">
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#F9C5D5]" />
                      Khung giờ khả dụng
                    </span>
                    <Badge variant="secondary" className="text-xs bg-[#F9C5D5]/20 text-[#2C3E50]">
                      {availableSlots.length} slot
                    </Badge>
                  </label>
                  <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto p-2 bg-pink-50/50 rounded-lg">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot, idx) => {
                        const isSelected = selectedSlots.some(
                          (s) => s.start.getTime() === slot.start.getTime()
                        );
                        return (
                          <Button
                            key={idx}
                            variant={isSelected ? "default" : "outline"}
                            className={`w-full transition-all duration-200 ${isSelected
                              ? "bg-[#2C3E50] hover:bg-[#1a252f] text-white shadow-md scale-105"
                              : "border-[#F9C5D5]/50 text-[#333333] hover:bg-[#F9C5D5]/20 hover:border-[#F9C5D5]"
                              }`}
                            onClick={() => handleSlotSelect(slot)}
                          >
                            {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
                          </Button>
                        );
                      })
                    ) : (
                      <p className="col-span-2 text-center text-sm text-gray-500 py-4">
                        Không có khung giờ trống
                      </p>
                    )}
                  </div>
                </div>

                {selectedSlots.length > 0 && (
                  <div className="bg-[#F9C5D5]/10 p-4 rounded-lg border-2 border-[#F9C5D5]/30">
                    <label className="text-sm font-semibold text-[#2C3E50] mb-3 flex items-center justify-between">
                      <span>Đã chọn ({selectedSlots.length})</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSlots([])}
                        className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Xóa tất cả
                      </Button>
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedSlots
                        .sort((a, b) => a.start - b.start)
                        .map((slot, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white p-2 rounded-lg text-sm border border-[#F9C5D5]/30"
                          >
                            <span className="text-[#333333]">
                              {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
                              <span className="text-xs text-gray-500 ml-2">
                                {format(slot.start, "dd/MM", { locale: vi })}
                              </span>
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-red-100"
                              onClick={() =>
                                setSelectedSlots((prev) =>
                                  prev.filter(
                                    (s) => s.start.getTime() !== slot.start.getTime()
                                  )
                                )
                              }
                            >
                              <X className="h-3 w-3 text-red-500" />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm font-semibold text-[#2C3E50] mb-2 block">
                    Ghi chú cho mentor
                  </label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Chia sẻ mục tiêu hoặc câu hỏi bạn muốn thảo luận..."
                    className="w-full bg-white text-[#333333] border-[#F9C5D5]/30 min-h-[80px] focus:border-[#F9C5D5] focus:ring-2 focus:ring-[#F9C5D5]/20 transition-all"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || selectedSlots.length === 0}
                  className="w-full bg-[#2C3E50] hover:bg-[#1a252f] text-white py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    "Đang xử lý..."
                  ) : selectedSlots.length === 0 ? (
                    "Chọn khung giờ để tiếp tục"
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Xác nhận đặt lịch - {calculatedPrice}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};