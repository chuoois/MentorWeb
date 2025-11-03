import React, { useEffect, useState } from "react";
import BookingService from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Link } from "lucide-react";
import { toast } from "react-hot-toast";

// Map status to colors and labels
const statusConfig = {
  PENDING: {
    bg: "bg-blue-400",
    text: "Chờ xác nhận",
    badge: "bg-blue-100 text-blue-700",
  },
  CONFIRMED: {
    bg: "bg-green-400",
    text: "Đã xác nhận",
    badge: "bg-green-100 text-green-700",
  },
  COMPLETED: {
    bg: "bg-gray-400",
    text: "Hoàn thành",
    badge: "bg-gray-100 text-gray-700",
  },
  CANCELLED: {
    bg: "bg-red-400",
    text: "Đã hủy",
    badge: "bg-red-100 text-red-700",
  },
  UPCOMING: {
    bg: "bg-yellow-400",
    text: "Sắp diễn ra",
    badge: "bg-yellow-100 text-yellow-700",
  },
};

// Utility: Get week days
const getWeekDays = (date) => {
  const startOfWeek = new Date(date);
  const dayOfWeek = startOfWeek.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  startOfWeek.setDate(startOfWeek.getDate() + diff);
  startOfWeek.setHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    days.push(day);
  }
  return days;
};

// Utility: Get month days
const getMonthDays = (date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const daysInMonth = endOfMonth.getDate();
  const firstDayOfWeek = startOfMonth.getDay();

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), i));
  }
  return days;
};

// Generate hour slots (8h - 22h)
const hours = Array.from({ length: 15 }, (_, i) => i + 8);

// Normalize and flatten sessionTimes
const normalizeBookings = (bookings) => {
  if (!Array.isArray(bookings)) {
    console.warn("normalizeBookings: Expected array, got:", bookings);
    return [];
  }

  const normalized = [];
  bookings.forEach((booking) => {
    const bookingId = booking.id || booking._id;
    if (!bookingId) {
      console.warn("Booking thiếu id/_id:", booking);
      return;
    }

    if (booking.sessionTimes && Array.isArray(booking.sessionTimes)) {
      booking.sessionTimes.forEach((session, index) => {
        normalized.push({
          ...booking,
          _id: session._id || `${bookingId}_session_${index}`,
          start_time: session.startTime,
          end_time: session.endTime,
          session_status: session.status,
          meeting_link: session.meetingLink || "",
          note: session.note || "",
          original_booking_id: bookingId,
          session_index: index,
          mentor_confirmed: session.mentorConfirmed || false,
          mentee_confirmed: session.menteeConfirmed || false,
          completed_at: session.completed_at,
        });
      });
    } else {
      normalized.push({
        ...booking,
        _id: bookingId,
        start_time: booking.start_time || null,
        end_time: booking.end_time || null,
        session_status: booking.status,
        meeting_link: booking.meeting_link || "",
        original_booking_id: bookingId,
        session_index: 0,
        mentor_confirmed: booking.mentor_confirmed || false,
        mentee_confirmed: booking.mentee_confirmed || false,
        note: booking.note,
        completed_at: booking.completed_at,
      });
    }
  });

  return normalized.filter((b) => b.start_time && b.end_time && b.original_booking_id);
};

// Group consecutive bookings
const groupConsecutiveBookings = (bookings) => {
  if (!bookings || !Array.isArray(bookings) || bookings.length === 0) return [];

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(a.start_time) - new Date(b.start_time)
  );

  const grouped = [];
  let currentGroup = null;

  sortedBookings.forEach((booking) => {
    const bookingStart = new Date(booking.start_time);

    if (!currentGroup) {
      currentGroup = { ...booking, original_bookings: [booking] };
    } else {
      const currentEnd = new Date(currentGroup.end_time);
      const timeDiff = Math.abs(bookingStart.getTime() - currentEnd.getTime());
      const isConsecutive =
        timeDiff < 60000 &&
        booking.mentee?._id === currentGroup.mentee?._id &&
        booking.session_status === currentGroup.session_status &&
        booking.original_booking_id === currentGroup.original_booking_id;

      if (isConsecutive) {
        currentGroup.end_time = booking.end_time;
        currentGroup.original_bookings.push(booking);
      } else {
        grouped.push(currentGroup);
        currentGroup = { ...booking, original_bookings: [booking] };
      }
    }
  });

  if (currentGroup) grouped.push(currentGroup);
  return grouped;
};

// Check if date is today
const isToday = (date) => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const MentorSchedule = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [viewMode, setViewMode] = useState("week");
  const [meetingLink, setMeetingLink] = useState("");
  const [note, setNote] = useState("");

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await BookingService.getMentorApplications();
        const bookingsList = response.data;
        console.log("Bookings from API:", bookingsList);
        const normalizedBookings = normalizeBookings(bookingsList);
        setBookings(normalizedBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error("Không thể tải danh sách booking");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Sync form fields
  useEffect(() => {
    if (selectedBooking) {
      setMeetingLink(selectedBooking.meeting_link || "");
      setNote(selectedBooking.note || "");
    }
  }, [selectedBooking]);

  const weekDays = getWeekDays(currentDate);
  const monthDays = getMonthDays(currentDate);
  const groupedBookings = groupConsecutiveBookings(bookings);

  const getBookingsForDay = (day) => {
    if (!day) return [];
    return groupedBookings.filter((b) => {
      const bookingStart = new Date(b.start_time);
      const localDate = new Date(bookingStart.getFullYear(), bookingStart.getMonth(), bookingStart.getDate());
      const checkDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      return localDate.getTime() === checkDate.getTime();
    });
  };

  const prevPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    setCurrentDate(newDate);
  };

  const nextPeriod = () => {
    const newDate = new Date(currentDate);
    if (viewMode === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());
  const handleDayClick = (day) => {
    setCurrentDate(day);
    setViewMode("week");
  };

  // XÁC NHẬN BUỔI HỌC
  const handleConfirmSession = async () => {
    if (!selectedBooking || selectedBooking.session_index === undefined) {
      toast.error("Không tìm thấy thông tin phiên.");
      return;
    }

    try {
      const response = await BookingService.confirmSessionByMentor(
        selectedBooking.original_booking_id,
        selectedBooking.session_index
      );
      console.log("Confirm session response:", response);

      const newStatus = response.data?.status || "PENDING";
      const mentorConfirmed = true;
      const menteeConfirmed = response.data?.menteeConfirmed || false;

      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, session_status: newStatus, mentor_confirmed: mentorConfirmed, mentee_confirmed: menteeConfirmed }
            : b
        )
      );

      setSelectedBooking((prev) => ({
        ...prev,
        session_status: newStatus,
        mentor_confirmed: mentorConfirmed,
        mentee_confirmed: menteeConfirmed,
      }));

      toast.success(response.message || "Xác nhận buổi học thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Xác nhận thất bại");
    }
  };

  // CẬP NHẬT LINK HỌP
  const handleUpdateSession = async () => {
    if (!selectedBooking || selectedBooking.session_index === undefined) {
      toast.error("Không tìm thấy thông tin phiên.");
      return;
    }

    if (!meetingLink.trim()) {
      toast.error("Vui lòng nhập link họp");
      return;
    }

    try {
      const response = await BookingService.updateSessionLinkByMentor(
        selectedBooking.original_booking_id,
        selectedBooking.session_index,
        meetingLink
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, meeting_link: meetingLink, mentor_confirmed: true }
            : b
        )
      );

      setSelectedBooking((prev) => ({
        ...prev,
        meeting_link: meetingLink,
        mentor_confirmed: true,
      }));

      toast.success(response.message || "Cập nhật link thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Cập nhật link thất bại");
    }
  };

  // HỦY BUỔI HỌC
  const handleCancelSession = async () => {
    if (!selectedBooking || selectedBooking.session_index === undefined) {
      toast.error("Không tìm thấy thông tin phiên.");
      return;
    }

    try {
      const response = await BookingService.cancelSessionByMentor(
        selectedBooking.original_booking_id,
        selectedBooking.session_index
      );

      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, session_status: "CANCELLED", mentor_confirmed: false }
            : b
        )
      );

      setSelectedBooking((prev) => ({
        ...prev,
        session_status: "CANCELLED",
        mentor_confirmed: false,
      }));

      toast.success(response.message || "Hủy buổi học thành công");
    } catch (error) {
      toast.error(error.response?.data?.message || "Hủy buổi học thất bại");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-40 space-y-2">
        <Spinner className="w-7 h-7" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500 text-xs">Đang tải lịch của bạn...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[90vw] mx-auto p-2">
      {/* Header */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md" style={{ backgroundColor: "#F9C5D5" }}>
              <Calendar className="w-4 h-4" style={{ color: "#2C3E50" }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "#333333" }}>
                Lịch của bạn
              </h2>
              <p className="text-xs text-gray-500">
                {viewMode === "week"
                  ? `Tuần từ ${weekDays[0].toLocaleDateString("vi-VN")} - ${weekDays[6].toLocaleDateString("vi-VN")}`
                  : `${currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              onClick={() => setViewMode(viewMode === "week" ? "month" : "week")}
              size="sm"
              className="text-white hover:opacity-90 text-xs px-2"
              style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
            >
              {viewMode === "week" ? "Tháng" : "Tuần"}
            </Button>
            <Button onClick={prevPeriod} variant="outline" size="sm" className="gap-1 border-gray-300 hover:bg-gray-50 text-xs px-2" style={{ color: "#2C3E50" }}>
              <ChevronLeft className="w-3 h-3" />
            </Button>
            <Button onClick={goToToday} size="sm" className="text-white hover:opacity-90 text-xs px-2" style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}>
              Hôm nay
            </Button>
            <Button onClick={nextPeriod} variant="outline" size="sm" className="gap-1 border-gray-300 hover:bg-gray-50 text-xs px-2" style={{ color: "#2C3E50" }}>
              <ChevronRight className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-1.5 pt-1.5 border-t border-gray-100">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded ${config.bg}`}></div>
              <span className="text-xs" style={{ color: "#333333" }}>{config.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Week View */}
      {viewMode === "week" && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <div className="grid grid-cols-[50px_repeat(7,minmax(120px,1fr))] border-b border-gray-200">
                <div className="border-r border-gray-200" style={{ backgroundColor: "#F9F9F9" }}></div>
                {weekDays.map((day, dayIndex) => {
                  const today = isToday(day);
                  return (
                    <div
                      key={dayIndex}
                      className="py-1 text-center border-r border-gray-200 last:border-r-0"
                      style={{ backgroundColor: today ? "#F9C5D5" : "#F9F9F9" }}
                    >
                      <div className="text-xs font-medium uppercase" style={{ color: today ? "#2C3E50" : "#666666" }}>
                        {day.toLocaleDateString("vi-VN", { weekday: "short" })}
                      </div>
                      <div className="text-sm font-bold" style={{ color: today ? "#2C3E50" : "#333333" }}>
                        {day.getDate()}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-[50px_repeat(7,minmax(120px,1fr))]">
                <div className="border-r border-gray-200" style={{ backgroundColor: "#F9F9F9" }}>
                  {hours.map((hour) => (
                    <div key={hour} className="h-10 flex items-start justify-center pt-1 text-xs font-medium text-gray-500 border-b border-gray-100">
                      {hour}:00
                    </div>
                  ))}
                </div>

                {weekDays.map((day, dayIndex) => {
                  const today = isToday(day);
                  return (
                    <div key={dayIndex} className="border-r border-gray-200 last:border-r-0 relative" style={{ backgroundColor: today ? "#FFF5F8" : "transparent" }}>
                      {hours.map((hour) => (
                        <div key={hour} className="h-10 border-b border-gray-100"></div>
                      ))}
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="relative h-full pointer-events-auto">
                          {getBookingsForDay(day).map((b) => {
                            const bookingStart = new Date(b.start_time);
                            const bookingEnd = new Date(b.end_time);
                            const startHour = bookingStart.getHours();
                            const startMinutes = bookingStart.getMinutes();
                            const duration = (bookingEnd - bookingStart) / (1000 * 60);
                            if (startHour < 8 || startHour >= 23) return null;

                            const topOffset = (startHour - 8) * 40 + (startMinutes / 60) * 40;
                            const height = (duration / 60) * 40;
                            const config = statusConfig[b.session_status] || statusConfig.PENDING;

                            return (
                              <div
                                key={b._id}
                                className={`absolute left-0.5 right-0.5 rounded-md text-white text-xs p-1 shadow-sm ${config.bg} hover:opacity-90 transition-all cursor-pointer group overflow-hidden`}
                                style={{ top: `${topOffset}px`, height: `${Math.max(height, 20)}px` }}
                                onClick={() => setSelectedBooking(b)}
                                title="Nhấn để xem chi tiết"
                              >
                                <div className="flex flex-col h-full justify-between">
                                  <div>
                                    <div className="font-semibold flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {bookingStart.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                    </div>
                                    {height > 30 && (
                                      <div className="flex items-center gap-1 text-white/90 truncate">
                                        <User className="w-3 h-3" />
                                        {b.mentee?.fullName || "Chưa xác định"}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Month View */}
      {viewMode === "month" && (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 p-2">
          <div className="grid grid-cols-7 gap-0.5">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-gray-500">
                {day}
              </div>
            ))}
            {monthDays.map((day, index) => {
              const today = day && isToday(day);
              const bookings = day ? getBookingsForDay(day) : [];
              return (
                <div
                  key={index}
                  className={`h-14 border border-gray-100 rounded-md flex flex-col items-center justify-between p-0.5
                    ${day ? "hover:bg-gray-50 cursor-pointer" : "bg-gray-50"} 
                    ${today ? "bg-pink-50 border-pink-200" : ""}`}
                  onClick={day ? () => handleDayClick(day) : undefined}
                >
                  {day && (
                    <>
                      <div className={`text-xs font-medium ${today ? "text-pink-700" : "text-gray-700"}`}>
                        {day.getDate()}
                      </div>
                      <div className="flex flex-col gap-0.5 w-full">
                        {bookings.slice(0, 2).map((b) => {
                          const config = statusConfig[b.session_status] || statusConfig.PENDING;
                          return (
                            <div
                              key={b._id}
                              className={`text-xs text-white ${config.bg} rounded px-1 py-0.5 truncate`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(b);
                              }}
                            >
                              {new Date(b.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          );
                        })}
                        {bookings.length > 2 && <div className="text-xs text-gray-500">+{bookings.length - 2}</div>}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {bookings.length === 0 && !loading && (
        <div className="text-center py-5 bg-white rounded-md shadow-sm border border-gray-200 mt-2">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium" style={{ color: "#333333" }}>Chưa có lịch hẹn nào</p>
          <p className="text-gray-400 text-xs mt-1">Lịch hẹn học tập</p>
        </div>
      )}

      {/* Modal chi tiết */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white rounded-md shadow-xl max-w-md w-full p-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-base font-bold" style={{ color: "#333333" }}>Chi tiết lịch hẹn</h3>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-gray-600">x</button>
            </div>

            <div className="space-y-1.5">
              <div>
                <label className="text-xs font-medium text-gray-500">Mentee</label>
                <p className="text-sm font-medium" style={{ color: "#333333" }}>{selectedBooking.mentee?.fullName || "Chưa xác định"}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Thời gian</label>
                <p className="text-xs" style={{ color: "#333333" }}>
                  {new Date(selectedBooking.start_time).toLocaleString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
                <p className="text-sm font-medium" style={{ color: "#2C3E50" }}>
                  {new Date(selectedBooking.start_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })} -{" "}
                  {new Date(selectedBooking.end_time).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Trạng thái</label>
                <div className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[selectedBooking.session_status]?.badge || "bg-gray-100 text-gray-800"}`}>
                  {statusConfig[selectedBooking.session_status]?.text || selectedBooking.session_status}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500">Xác nhận</label>
                <p className="text-xs" style={{ color: "#333333" }}>
                  Mentor: {selectedBooking.mentor_confirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                </p>
                <p className="text-xs" style={{ color: "#333333" }}>
                  Mentee: {selectedBooking.mentee_confirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                </p>
              </div>

              {selectedBooking.meeting_link && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Link họp</label>
                  <div className="flex items-center gap-1 mt-1">
                    <Link className="w-3 h-3 text-gray-500" />
                    <a href={selectedBooking.meeting_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs truncate">
                      {selectedBooking.meeting_link}
                    </a>
                  </div>
                </div>
              )}

              {selectedBooking.session_status !== "COMPLETED" && selectedBooking.session_status !== "CANCELLED" && (
                <div>
                  <label className="text-xs font-medium text-gray-500">Cập nhật link họp</label>
                  <Input value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://meet.google.com/..." className="mt-1 text-xs" />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {selectedBooking.session_status !== "COMPLETED" && selectedBooking.session_status !== "CANCELLED" && (
              <div className="mt-3 space-y-2">
                {!selectedBooking.mentor_confirmed &&
                  !["COMPLETED", "CANCELLED"].includes(selectedBooking.session_status) && (
                    <Button
                      onClick={handleConfirmSession}
                      className="w-full text-white hover:opacity-90 text-xs"
                      style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
                    >
                      Xác nhận buổi học
                    </Button>
                  )}

                <Button onClick={handleUpdateSession} className="w-full text-white hover:opacity-90 text-xs" style={{ backgroundColor: "#007BFF", color: "#FFFFFF" }}>
                  Cập nhật link
                </Button>

                {selectedBooking.session_status === "PENDING" && (
                  <Button onClick={handleCancelSession} className="w-full text-white hover:opacity-90 text-xs" style={{ backgroundColor: "#DC3545", color: "#FFFFFF" }}>
                    Hủy buổi học
                  </Button>
                )}
              </div>
            )}

            <div className="mt-3">
              <Button onClick={() => setSelectedBooking(null)} variant="outline" className="w-full text-xs" style={{ borderColor: "#F9C5D5", color: "#2C3E50" }}>
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};