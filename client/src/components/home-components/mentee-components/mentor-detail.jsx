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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Star,
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
  DollarSign,
} from "lucide-react";
import { toast } from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addHours, startOfDay, addDays } from "date-fns";
import { vi } from "date-fns/locale";
import MentorService from "@/services/mentor.service";
import BookingService from "@/services/booking.service";
import { Skeleton } from "@/components/ui/skeleton";

// MentorSkeleton component (giữ nguyên)
const MentorSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
    <div className="lg:col-span-3 space-y-4">
      <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-1/2 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700" />
              <Skeleton className="h-3 w-1/3 bg-gray-200 dark:bg-gray-700" />
              <div className="flex gap-2">
                <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-700" />
                <Skeleton className="h-4 w-12 bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm">
        <CardContent className="p-4">
          <Skeleton className="h-4 w-1/3 mb-2 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-3 w-full bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-3 w-3/4 bg-gray-200 dark:bg-gray-700" />
        </CardContent>
      </Card>
    </div>
    <Card className="lg:col-span-2 border-0 bg-white dark:bg-gray-900 shadow-sm">
      <CardHeader>
        <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-32 w-full bg-gray-200 dark:bg-gray-700" />
        <Skeleton className="h-6 w-full bg-gray-200 dark:bg-gray-700" />
      </CardContent>
    </Card>
  </div>
);

export const MentorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(addDays(new Date(), 5));
  const [selectedDays, setSelectedDays] = useState([addDays(new Date(), 5)]);
  const [selectedSlots, setSelectedSlots] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [note, setNote] = useState("");
  const [sessionDuration, setSessionDuration] = useState(1);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const durationOptions = [1, 1.5, 2, 2.5, 3];

  const checkAuthToken = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  useEffect(() => {
    const fetchMentorAndBookings = async () => {
      try {
        setLoading(true);
        const [resMentor, resBookings] = await Promise.all([
          MentorService.getMentorByID(id),
          BookingService.getBookedSlots(id),
        ]);
        setMentor(resMentor.mentor);
        setBookedSlots(resBookings.bookedSlots || []);
      } catch (error) {
        console.error(error);
        toast.error("Không thể tải dữ liệu mentor hoặc lịch đặt");
      } finally {
        setLoading(false);
      }
    };
    fetchMentorAndBookings();
  }, [id]);

  const generateAvailableSlots = useCallback(
    (date) => {
      const slots = new Set();
      const startHour = Number(mentor.availability?.startTime);
      const endHour = Number(mentor.availability?.endTime);
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
          const slotKey = `${format(startTime, "HH:mm")}-${format(endTime, "HH:mm")}`;
          slots.add(JSON.stringify({ start: startTime, end: endTime }));
        }
      }

      return Array.from(slots).map((slot) => JSON.parse(slot));
    },
    [sessionDuration, bookedSlots]
  );

  const handleSlotSelect = (slot) => {
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    setSelectedSlots((prev) => {
      const slotsForDate = prev[dateKey] || [];
      const exists = slotsForDate.some(
        (s) => s.start.getTime() === slot.start.getTime()
      );
      if (exists) {
        const filtered = slotsForDate.filter(
          (s) => s.start.getTime() !== slot.start.getTime()
        );
        const newSlots = { ...prev };
        if (filtered.length > 0) {
          newSlots[dateKey] = filtered;
        } else {
          delete newSlots[dateKey];
        }
        return newSlots;
      }
      return {
        ...prev,
        [dateKey]: [...slotsForDate, slot],
      };
    });
  };

  const handleAddDate = () => {
    const newDate = addDays(selectedDate, 1);
    const minDate = addDays(new Date(), 5);
    if (
      newDate >= minDate &&
      !selectedDays.some((d) => format(d, "yyyy-MM-dd") === format(newDate, "yyyy-MM-dd"))
    ) {
      setSelectedDays((prev) => [...prev, newDate]);
      setSelectedDate(newDate);
    } else {
      toast.error("Ngày này đã được chọn hoặc không hợp lệ!");
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    const dateKey = format(dateToRemove, "yyyy-MM-dd");
    setSelectedDays((prev) => {
      const newDays = prev.filter((d) => format(d, "yyyy-MM-dd") !== dateKey);
      return newDays.length > 0 ? newDays : [addDays(new Date(), 5)];
    });
    setSelectedSlots((prev) => {
      const newSlots = { ...prev };
      delete newSlots[dateKey];
      return newSlots;
    });
    if (format(selectedDate, "yyyy-MM-dd") === dateKey) {
      const newDays = selectedDays.filter((d) => format(d, "yyyy-MM-dd") !== dateKey);
      setSelectedDate(newDays.length > 0 ? newDays[0] : addDays(new Date(), 5));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkAuthToken()) {
      setIsLoginModalOpen(true);
      return;
    }

    const minAllowedDate = addDays(new Date(), 5);
    const allSlots = Object.entries(selectedSlots).flatMap(([date, slots]) =>
      slots.map((slot) => ({ ...slot, date: new Date(date) }))
    );

    if (allSlots.length === 0) {
      toast.error("Vui lòng chọn ít nhất một khung giờ");
      return;
    }

    if (allSlots.some((slot) => slot.date < startOfDay(minAllowedDate))) {
      toast.error("Ngày đặt lịch phải từ 5 ngày sau trở đi!");
      return;
    }

    const sessionTimes = allSlots.map((slot) => ({
      start_time: slot.start.toISOString(),
      end_time: slot.end.toISOString(),
    }));

    const sessionTimesText = allSlots
      .map(
        (slot) =>
          `từ ${format(slot.start, "HH:mm")} đến ${format(slot.end, "HH:mm")} ngày ${format(slot.start, "dd/MM/yyyy")}`
      )
      .join(", ");
    const confirm = window.confirm(
      `Bạn có chắc muốn đặt ${allSlots.length} buổi mentoring với ${mentor.full_name} vào các khung giờ: ${sessionTimesText}?`
    );
    if (!confirm) return;

    setLoading(true);
    try {
      const bookingData = {
        mentorId: id,
        session_times: sessionTimes,
        note,
      };
      const bookingResponse = await BookingService.createBooking(bookingData);
      toast.success("Đặt lịch thành công! Đang chuyển hướng đến trang thanh toán...");
      const paymentLink = bookingResponse.payment?.checkoutUrl;
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        toast.error("Không thể tạo link thanh toán. Vui lòng thử lại sau.");
        navigate(`/booking-confirmation/${bookingResponse.booking._id}`);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.message || "Lỗi khi đặt lịch hoặc tạo link thanh toán";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FFFFFF] dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MentorSkeleton />
        </div>
      </main>
    );
  }

  if (!mentor) {
    return (
      <main className="min-h-screen bg-[#FFFFFF] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-sm">
          <h1 className="text-xl font-semibold text-[#2C3E50] dark:text-white mb-3">
            Không tìm thấy mentor
          </h1>
          <Link to="/listmentor">
            <Button className="bg-[#2C3E50] hover:bg-[#1a252f] text-white px-4 py-1.5 rounded-md text-sm shadow-sm hover:shadow-md transition-all duration-200">
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              Quay về danh sách Mentor
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const totalSlots = Object.values(selectedSlots).flat().length;
  const totalDuration = totalSlots * sessionDuration;
  const calculatedPrice = (mentor.price * totalDuration).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const sortedRatings = [...(mentor.ratings || [])].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const availableSlots = generateAvailableSlots(selectedDate);

  return (
    <main className="min-h-screen bg-[#FFFFFF] dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/listmentor"
          className="inline-flex items-center gap-1.5 text-[#2C3E50] dark:text-gray-200 hover:text-[#F9C5D5] mb-4 text-sm font-medium transition-all duration-200 group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Quay lại danh sách Mentor
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-3 space-y-4">
            <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-2 ring-[#F9C5D5]/20 hover:ring-[#F9C5D5]/40 transition-all duration-200">
                    <AvatarImage
                      src={mentor.avatar_url || "/placeholder.svg"}
                      alt={mentor.full_name}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg bg-[#F9C5D5] text-[#2C3E50]">
                      {mentor.full_name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-xl sm:text-2xl font-semibold text-[#2C3E50] dark:text-white">
                        {mentor.full_name}
                      </h1>
                      {mentor.average_rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[#F9C5D5] text-[#F9C5D5]" />
                          <span className="text-sm font-medium text-[#2C3E50] dark:text-gray-200">
                            {mentor.average_rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-[#333333] dark:text-gray-300 mb-1">
                      {mentor.job_title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Award className="h-3 w-3 text-[#F9C5D5]" />
                      {mentor.company} · {mentor.current_position}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {(mentor.category || "").split(",").map((category, idx) => (
                        <Badge
                          key={idx}
                          className="bg-[#F9C5D5] text-[#2C3E50] text-xs px-2 py-0.5 hover:bg-[#F9C5D5]/80 transition-all duration-200"
                        >
                          {category.trim()}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {mentor.linkedin_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          as="a"
                          href={mentor.linkedin_url}
                          target="_blank"
                          className="border-[#F9C5D5] text-[#2C3E50] hover:bg-[#F9C5D5]/10 px-3 py-1 text-xs rounded-md transition-all duration-200 relative group"
                        >
                          <Linkedin className="h-3 w-3 mr-1" />
                          LinkedIn
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block text-xs text-white bg-[#2C3E50] px-2 py-0.5 rounded">
                            Xem LinkedIn
                          </span>
                        </Button>
                      )}
                      {mentor.personal_link_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          as="a"
                          href={mentor.personal_link_url}
                          target="_blank"
                          className="border-[#F9C5D5] text-[#2C3E50] hover:bg-[#F9C5D5]/10 px-3 py-1 text-xs rounded-md transition-all duration-200 relative group"
                        >
                          <Globe className="h-3 w-3 mr-1" />
                          Website
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block text-xs text-white bg-[#2C3E50] px-2 py-0.5 rounded">
                            Xem website
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm rounded-xl">
              <CardHeader className="p-4 border-b border-[#F9C5D5]/10">
                <CardTitle className="text-base flex items-center gap-1 text-[#2C3E50] dark:text-white">
                  <TrendingUp className="h-3.5 w-3.5 text-[#F9C5D5]" />
                  Giới thiệu
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 text-sm text-[#333333] dark:text-gray-300">
                {mentor.bio}
              </CardContent>
            </Card>

            {mentor.skill && (
              <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm rounded-xl">
                <CardHeader className="p-4 border-b border-[#F9C5D5]/10">
                  <CardTitle className="text-base flex items-center gap-1 text-[#2C3E50] dark:text-white">
                    <Award className="h-3.5 w-3.5 text-[#F9C5D5]" />
                    Kỹ năng
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-2">
                    {(mentor.skill || "").split(",").map((skill, idx) => (
                      <Badge
                        key={idx}
                        className="bg-white dark:bg-gray-800 border-[#F9C5D5] border text-[#2C3E50] dark:text-gray-200 text-xs px-2 py-0.5 hover:bg-[#F9C5D5] hover:text-white transition-all duration-200"
                      >
                        {skill.trim()}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="border-0 bg-white dark:bg-gray-900 shadow-sm rounded-xl">
              <CardHeader className="p-4 border-b border-[#F9C5D5]/10">
                <CardTitle className="text-base flex items-center gap-1 text-[#2C3E50] dark:text-white">
                  <MessageCircle className="h-3.5 w-3.5 text-[#F9C5D5]" />
                  Bình luận ({sortedRatings.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {sortedRatings.length > 0 ? (
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {sortedRatings.map((rating, idx) => (
                      <div
                        key={idx}
                        className="flex gap-3 border-b border-[#F9C5D5]/10 pb-3 last:border-b-0"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={rating.mentee?.avatar_url || "/placeholder.svg"}
                            alt={rating.mentee?.full_name}
                          />
                          <AvatarFallback className="bg-[#F9C5D5] text-[#2C3E50] text-xs">
                            {rating.mentee?.full_name?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs font-medium text-[#2C3E50] dark:text-gray-200">
                              {rating.mentee?.full_name || "Người dùng"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {format(new Date(rating.created_at), "dd/MM/yyyy HH:mm", {
                                locale: vi,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < rating.score
                                    ? "fill-[#F9C5D5] text-[#F9C5D5]"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-[#333333] dark:text-gray-300">
                            {rating.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-6">
                    Chưa có bình luận nào.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="sticky top-4 border-0 bg-white dark:bg-gray-900 shadow-sm rounded-xl">
              <CardHeader className="p-4 bg-gradient-to-r from-[#F9C5D5]/20 to-[#2C3E50]/10">
                <CardTitle className="text-base flex items-center gap-1 text-[#2C3E50] dark:text-white">
                  <Calendar className="h-3.5 w-3.5 text-[#F9C5D5]" />
                  Đặt lịch mentoring
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="bg-[#F9C5D5]/5 p-3 rounded-md">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-[#333333] dark:text-gray-200">
                      Tổng chi phí
                    </span>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-[#F9C5D5]" />
                      <span className="text-base font-semibold text-[#2C3E50] dark:text-white">
                        {totalSlots > 0
                          ? calculatedPrice
                          : `${mentor.price?.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })}/giờ`}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {sessionDuration} giờ × {totalSlots} buổi
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2C3E50] dark:text-gray-200 flex items-center gap-1 mb-1">
                    <Clock className="h-3 w-3 text-[#F9C5D5]" />
                    Thời lượng mỗi buổi
                  </label>
                  <select
                    value={sessionDuration}
                    onChange={(e) => {
                      setSessionDuration(parseFloat(e.target.value));
                      setSelectedSlots({});
                    }}
                    className="w-full p-2 border border-[#F9C5D5]/20 rounded-md bg-white dark:bg-gray-800 text-xs text-[#333333] dark:text-gray-200 focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]/20 transition-all duration-200"
                  >
                    {durationOptions.map((d) => (
                      <option key={d} value={d}>
                        {d} giờ
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2C3E50] dark:text-gray-200 flex items-center gap-1 mb-1">
                    <Calendar className="h-3 w-3 text-[#F9C5D5]" />
                    Chọn ngày
                  </label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Đặt từ {format(addDays(new Date(), 5), "dd/MM/yyyy")} trở đi
                  </p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedDays.map((day, idx) => (
                      <Button
                        key={idx}
                        variant={
                          format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                            ? "default"
                            : "outline"
                        }
                        className={`text-xs px-2 py-1 rounded-md flex items-center gap-1 ${
                          format(day, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                            ? "bg-[#2C3E50] text-white hover:bg-[#1a252f]"
                            : "border-[#F9C5D5] text-[#2C3E50] dark:text-gray-200 hover:bg-[#F9C5D5]/10"
                        } transition-all duration-200`}
                        onClick={() => setSelectedDate(day)}
                      >
                        {format(day, "dd/MM", { locale: vi })}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveDate(day);
                          }}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </span>
                      </Button>
                    ))}
                  </div>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date) => {
                      const dateKey = format(date, "yyyy-MM-dd");
                      if (!selectedDays.some((d) => format(d, "yyyy-MM-dd") === dateKey)) {
                        setSelectedDays((prev) => [...prev, date]);
                      }
                      setSelectedDate(date);
                    }}
                    minDate={addDays(new Date(), 5)}
                    dateFormat="dd/MM/yyyy"
                    locale={vi}
                    className="w-full p-2 border border-[#F9C5D5]/20 rounded-md bg-white dark:bg-gray-800 text-xs text-[#333333] dark:text-gray-200 focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]/20 transition-all duration-200"
                  />
                  <Button
                    onClick={handleAddDate}
                    variant="outline"
                    className="mt-2 w-full border-[#F9C5D5] text-[#2C3E50] dark:text-gray-200 hover:bg-[#F9C5D5]/10 text-xs py-1 rounded-md transition-all duration-200"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Thêm ngày
                  </Button>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#2C3E50] dark:text-gray-200 flex items-center justify-between mb-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#F9C5D5]" />
                      Khung giờ ({format(selectedDate, "dd/MM")})
                    </span>
                    <Badge className="bg-[#F9C5D5]/20 text-[#2C3E50] dark:text-gray-200 text-xs border-none">
                      {availableSlots.length} slot
                    </Badge>
                  </label>
                  <div className="max-h-64 overflow-y-auto space-y-1.5 p-2 bg-[#F9C5D5]/5 rounded-md">
                    {availableSlots.length > 0 ? (
                      [...new Set(availableSlots.map((slot) => `${format(slot.start, "HH:mm")}-${format(slot.end, "HH:mm")}`))]
                        .map((timeRange, idx) => {
                          const [startStr, endStr] = timeRange.split("-");
                          const startTime = new Date(selectedDate);
                          startTime.setHours(parseInt(startStr.split(":")[0]), parseInt(startStr.split(":")[1]));
                          const endTime = new Date(startTime);
                          endTime.setHours(parseInt(endStr.split(":")[0]), parseInt(endStr.split(":")[1]));
                          const slot = { start: startTime, end: endTime };
                          const dateKey = format(selectedDate, "yyyy-MM-dd");
                          const isSelected = (selectedSlots[dateKey] || []).some(
                            (s) => s.start.getTime() === slot.start.getTime()
                          );
                          return (
                            <Button
                              key={idx}
                              variant={isSelected ? "default" : "outline"}
                              className={`w-full justify-start text-xs py-1.5 rounded-md relative group ${
                                isSelected
                                  ? "bg-[#2C3E50] text-white hover:bg-[#1a252f]"
                                  : "border-[#F9C5D5] text-[#2C3E50] dark:text-gray-200 hover:bg-[#F9C5D5]/10"
                              } transition-all duration-200`}
                              onClick={() => handleSlotSelect(slot)}
                            >
                              <span className="w-16 text-left">{format(slot.start, "HH:mm")}</span>
                              <span className="text-gray-500 dark:text-gray-400 mx-2">→</span>
                              <span>{format(slot.end, "HH:mm")}</span>
                              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block text-xs text-white bg-[#2C3E50] px-2 py-0.5 rounded">
                                {isSelected ? "Bỏ chọn" : "Chọn"}
                              </span>
                            </Button>
                          );
                        })
                    ) : (
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-3">
                        Không có khung giờ trống
                      </p>
                    )}
                  </div>
                </div>

                {totalSlots > 0 && (
                  <div className="bg-[#F9C5D5]/5 p-2 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-[#2C3E50] dark:text-gray-200">
                        Đã chọn ({totalSlots})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedSlots({})}
                        className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 px-2 py-0.5"
                      >
                        Xóa tất cả
                      </Button>
                    </div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {Object.entries(selectedSlots)
                        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                        .map(([date, slots]) =>
                          slots
                            .sort((a, b) => a.start - b.start)
                            .map((slot, idx) => (
                              <div
                                key={`${date}-${idx}`}
                                className="flex items-center justify-between bg-white dark:bg-gray-800 p-1.5 rounded-md text-xs"
                              >
                                <span className="text-[#333333] dark:text-gray-200">
                                  {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")} ·{" "}
                                  {format(new Date(date), "dd/MM")}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-5 w-5 p-0 hover:bg-red-50 dark:hover:bg-red-900/10"
                                  onClick={() =>
                                    setSelectedSlots((prev) => {
                                      const newSlots = { ...prev };
                                      const slotsForDate = newSlots[date] || [];
                                      const filtered = slotsForDate.filter(
                                        (s) => s.start.getTime() !== slot.start.getTime()
                                      );
                                      if (filtered.length > 0) {
                                        newSlots[date] = filtered;
                                      } else {
                                        delete newSlots[date];
                                      }
                                      return newSlots;
                                    })
                                  }
                                >
                                  <X className="h-3 w-3 text-red-500" />
                                </Button>
                              </div>
                            ))
                        )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-[#2C3E50] dark:text-gray-200 mb-1 block">
                    Ghi chú
                  </label>
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Mục tiêu hoặc câu hỏi bạn muốn thảo luận..."
                    className="w-full bg-white dark:bg-gray-800 text-xs text-[#333333] dark:text-gray-200 border-[#F9C5D5]/20 min-h-[70px] rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]/20 transition-all duration-200"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={loading || totalSlots === 0}
                  className="w-full bg-[#2C3E50] hover:bg-[#1a252f] text-white py-2 text-xs font-medium rounded-md transition-all duration-200 disabled:opacity-50 relative group"
                >
                  {loading ? (
                    "Đang xử lý..."
                  ) : totalSlots === 0 ? (
                    "Chọn khung giờ"
                  ) : (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Xác nhận - {calculatedPrice}
                    </>
                  )}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1.5 hidden group-hover:block text-xs text-white bg-[#2C3E50] px-2 py-0.5 rounded">
                    Xác nhận đặt lịch
                  </span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-900 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-[#2C3E50] dark:text-white">
                Yêu cầu đăng nhập
              </DialogTitle>
              <DialogDescription className="text-sm text-[#333333] dark:text-gray-300">
                Bạn cần đăng nhập để đặt lịch mentoring. Vui lòng đăng nhập hoặc đăng ký tài khoản.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="sm:justify-start">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsLoginModalOpen(false)}
                className="mr-2 border-[#F9C5D5] text-[#2C3E50] dark:text-gray-200 hover:bg-[#F9C5D5]/10"
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={() => navigate("/auth/login")}
                className="bg-[#2C3E50] hover:bg-[#1a252f] text-white"
              >
                Đăng nhập
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
};