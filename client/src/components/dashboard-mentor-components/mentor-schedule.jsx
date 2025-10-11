
import React, { useEffect, useState } from "react";
import BookingService from "@/services/booking.service";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Calendar, Clock, User, Link } from "lucide-react";

// Map status to colors and labels with new color scheme
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
};

// Utility to get week days
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

// Generate hour slots
const hours = Array.from({ length: 15 }, (_, i) => i + 8);

// Normalize and flatten session_times into individual bookings
const normalizeBookings = (bookings) => {
  const normalized = [];
  bookings.forEach((booking) => {
    if (booking.session_times && booking.session_times.length > 0) {
      booking.session_times.forEach((session, index) => {
        normalized.push({
          ...booking,
          _id: session._id || booking.id || booking._id,
          start_time: session.start_time,
          end_time: session.end_time,
          session_status: session.status,
          meeting_link: session.meeting_link,
          note: session.note,
          original_booking_id: booking.id || booking._id,
          session_index: index,
        });
      });
    } else {
      normalized.push({
        ...booking,
        _id: booking.id || booking._id,
        start_time: booking.start_time || null,
        end_time: booking.end_time || null,
        session_status: booking.status,
        meeting_link: booking.meeting_link || "",
        note: booking.note || "",
        original_booking_id: booking.id || booking._id,
        session_index: null,
      });
    }
  });
  return normalized.filter((b) => b.start_time && b.end_time);
};

// Group consecutive bookings with improved logic
const groupConsecutiveBookings = (bookings) => {
  if (!bookings || bookings.length === 0) return [];
  
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.start_time) - new Date(b.start_time)
  );
  
  const grouped = [];
  let currentGroup = null;

  sortedBookings.forEach((booking) => {
    const bookingStart = new Date(booking.start_time);

    if (!currentGroup) {
      currentGroup = {
        ...booking,
        original_bookings: [booking],
      };
    } else {
      const currentEnd = new Date(currentGroup.end_time);
      const timeDiff = Math.abs(bookingStart.getTime() - currentEnd.getTime());
      const isConsecutive =
        timeDiff < 60000 &&
        booking.mentor?._id === currentGroup.mentor?._id &&
        booking.session_status === currentGroup.session_status &&
        booking.original_booking_id === currentGroup.original_booking_id;

      if (isConsecutive) {
        currentGroup.end_time = booking.end_time;
        currentGroup.original_bookings.push(booking);
      } else {
        grouped.push(currentGroup);
        currentGroup = {
          ...booking,
          original_bookings: [booking],
        };
      }
    }
  });

  if (currentGroup) {
    grouped.push(currentGroup);
  }

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
  const [meetingLink, setMeetingLink] = useState("");
  const [note, setNote] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await BookingService.getMentorBookedSlots();
        console.log(data);
        const bookingsList = data.bookedSlots || [];
        const normalizedBookings = normalizeBookings(bookingsList);
        setBookings(normalizedBookings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Update form fields when a booking is selected
  useEffect(() => {
    if (selectedBooking) {
      setMeetingLink(selectedBooking.meeting_link || "");
      setNote(selectedBooking.note || "");
      setCancelReason("");
    }
  }, [selectedBooking]);

  const weekDays = getWeekDays(currentDate);
  const groupedBookings = groupConsecutiveBookings(bookings);

  const getBookingsForDay = (day) => {
    return groupedBookings.filter((b) => {
      const bookingStart = new Date(b.start_time);
      const localDate = new Date(bookingStart.getFullYear(), bookingStart.getMonth(), bookingStart.getDate());
      const checkDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      return localDate.getTime() === checkDate.getTime();
    });
  };

  const prevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const nextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Handle updating application status
  const handleUpdateStatus = async (status) => {
    if (!selectedBooking) return;
    try {
      const data = {
        applicationId: selectedBooking.original_booking_id,
        status,
        ...(status === "CANCELLED" && cancelReason ? { cancel_reason: cancelReason } : {}),
      };
      const response = await BookingService.updateApplicationStatus(data);
      // Update bookings state
      setBookings((prev) =>
        prev.map((b) =>
          b.original_booking_id === selectedBooking.original_booking_id
            ? { ...b, session_status: status, status }
            : b
        )
      );
      setSelectedBooking(null);
      alert(`Cập nhật trạng thái thành công: ${status}`);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật trạng thái");
    }
  };

  // Handle updating session details
  const handleUpdateSession = async () => {
    if (!selectedBooking || selectedBooking.session_index === null) return;
    try {
      const data = {
        applicationId: selectedBooking.original_booking_id,
        sessionIndex: selectedBooking.session_index,
        meeting_link: meetingLink,
        note,
        markCompleted: false,
      };
      const response = await BookingService.updateSessionByMentor(data);
      // Update bookings state
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, meeting_link: response.data.meeting_link, note: response.data.note }
            : b
        )
      );
      setSelectedBooking(null);
      alert("Cập nhật session thành công");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi cập nhật session");
    }
  };

  // Handle marking session as completed
  const handleMarkCompleted = async () => {
    if (!selectedBooking || selectedBooking.session_index === null) return;
    try {
      const data = {
        applicationId: selectedBooking.original_booking_id,
        sessionIndex: selectedBooking.session_index,
        markCompleted: true,
      };
      const response = await BookingService.updateSessionByMentor(data);
      // Update bookings state
      setBookings((prev) =>
        prev.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, session_status: "COMPLETED", mentor_confirmed: true }
            : b
        )
      );
      setSelectedBooking(null);
      alert("Đánh dấu session hoàn thành thành công");
    } catch (error) {
      console.error(error);
      alert("Lỗi khi đánh dấu session hoàn thành");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Spinner className="w-12 h-12" style={{ color: '#F9C5D5' }} />
        <p className="text-gray-500">Đang tải lịch của bạn...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: '#F9C5D5' }}>
              <Calendar className="w-6 h-6" style={{ color: '#2C3E50' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: '#333333' }}>Lịch của bạn</h2>
              <p className="text-sm text-gray-500 mt-1">
                Tuần từ {weekDays[0].toLocaleDateString("vi-VN")} - {weekDays[6].toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              onClick={prevWeek} 
              variant="outline" 
              size="sm" 
              className="gap-1 border-gray-300 hover:bg-gray-50"
              style={{ color: '#2C3E50' }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Trước</span>
            </Button>
            <Button 
              onClick={goToToday} 
              size="sm"
              className="text-white hover:opacity-90"
              style={{ backgroundColor: '#F9C5D5', color: '#2C3E50' }}
            >
              Hôm nay
            </Button>
            <Button 
              onClick={nextWeek} 
              variant="outline" 
              size="sm" 
              className="gap-1 border-gray-300 hover:bg-gray-50"
              style={{ color: '#2C3E50' }}
            >
              <span className="hidden sm:inline">Sau</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
          {Object.entries(statusConfig).map(([status, config]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${config.bg}`}></div>
              <span className="text-xs" style={{ color: '#333333' }}>{config.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full">
            <div className="grid grid-cols-[60px_repeat(7,minmax(100px,1fr))] border-b border-gray-200">
              <div className="border-r border-gray-200" style={{ backgroundColor: '#F9F9F9' }}></div>
              
              {weekDays.map((day, dayIndex) => {
                const today = isToday(day);
                return (
                  <div
                    key={dayIndex}
                    className={`py-4 text-center border-r border-gray-200 last:border-r-0`}
                    style={{ 
                      backgroundColor: today ? '#F9C5D5' : '#F9F9F9'
                    }}
                  >
                    <div 
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: today ? '#2C3E50' : '#666666' }}
                    >
                      {day.toLocaleDateString("vi-VN", { weekday: "short" })}
                    </div>
                    <div 
                      className="text-lg font-bold mt-1"
                      style={{ color: today ? '#2C3E50' : '#333333' }}
                    >
                      {day.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-[60px_repeat(7,minmax(100px,1fr))]">
              <div className="border-r border-gray-200" style={{ backgroundColor: '#F9F9F9' }}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    className="h-20 flex items-start justify-center pt-1 text-xs font-medium text-gray-500 border-b border-gray-100"
                  >
                    {hour}:00
                  </div>
                ))}
              </div>

              {weekDays.map((day, dayIndex) => {
                const today = isToday(day);
                return (
                  <div
                    key={dayIndex}
                    className="border-r border-gray-200 last:border-r-0 relative"
                    style={{ backgroundColor: today ? '#FFF5F8' : 'transparent' }}
                  >
                    {hours.map((hour) => (
                      <div
                        key={hour}
                        className="h-20 border-b border-gray-100"
                      ></div>
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
                          
                          const topOffset = ((startHour - 8) * 80 + (startMinutes / 60) * 80);
                          const height = (duration / 60) * 80;
                          const config = statusConfig[b.session_status] || statusConfig.PENDING;

                          return (
                            <div
                              key={b._id}
                              className={`absolute left-1 right-1 rounded-lg text-white text-xs p-2 shadow-md ${config.bg} hover:opacity-90 transition-all cursor-pointer group overflow-hidden`}
                              style={{
                                top: `${topOffset}px`,
                                height: `${Math.max(height, 40)}px`,
                              }}
                              onClick={() => setSelectedBooking(b)}
                              title="Nhấn để xem chi tiết"
                            >
                              <div className="flex flex-col h-full justify-between">
                                <div>
                                  <div className="font-semibold flex items-center gap-1 mb-1">
                                    <Clock className="w-3 h-3" />
                                    {bookingStart.toLocaleTimeString("vi-VN", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                  {height > 60 && (
                                    <>
                                      <div className="flex items-center gap-1 text-white/90">
                                        <User className="w-3 h-3" />
                                        <span className="truncate">
                                          {b.mentee?.full_name || "Chưa xác định"}
                                        </span>
                                      </div>
                                      {b.note && height > 100 && (
                                        <div className="mt-1 text-white/80 text-xs truncate">
                                          {b.note}
                                        </div>
                                      )}
                                    </>
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

      {bookings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium" style={{ color: '#333333' }}>Chưa có lịch hẹn nào</p>
          <p className="text-gray-400 text-sm mt-2">Lịch hẹn học tập</p>
        </div>
      )}

      {selectedBooking && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold" style={{ color: '#333333' }}>Chi tiết lịch hẹn</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Mentee</label>
                <p className="text-base font-medium mt-1" style={{ color: '#333333' }}>
                  {selectedBooking.mentee?.full_name || "Chưa xác định"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Thời gian</label>
                <p className="text-base mt-1" style={{ color: '#333333' }}>
                  {new Date(selectedBooking.start_time).toLocaleString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-base font-medium mt-1" style={{ color: '#2C3E50' }}>
                  {new Date(selectedBooking.start_time).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(selectedBooking.end_time).toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Trạng thái phiên</label>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                  statusConfig[selectedBooking.session_status]?.badge || "bg-gray-100 text-gray-800"
                }`}>
                  {statusConfig[selectedBooking.session_status]?.text || selectedBooking.session_status}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Link họp</label>
                <Input
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="Nhập link họp (nếu có)"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Ghi chú</label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập ghi chú (nếu có)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              {selectedBooking.session_status !== "COMPLETED" && (
                <div>
                  <Button
                    onClick={handleUpdateSession}
                    className="w-full text-white hover:opacity-90"
                    style={{ backgroundColor: '#F9C5D5', color: '#2C3E50' }}
                  >
                    Cập nhật session
                  </Button>
                </div>
              )}

              {selectedBooking.session_status !== "COMPLETED" && (
                <div>
                  <Button
                    onClick={handleMarkCompleted}
                    className="w-full text-white hover:opacity-90"
                    style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                  >
                    Đánh dấu hoàn thành
                  </Button>
                </div>
              )}

              {selectedBooking.status === "PENDING" && (
                <>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Lý do hủy (nếu hủy)</label>
                    <Textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      placeholder="Nhập lý do hủy (tùy chọn)"
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleUpdateStatus("CONFIRMED")}
                      className="flex-1 text-white hover:opacity-90"
                      style={{ backgroundColor: '#4CAF50', color: '#FFFFFF' }}
                    >
                      Xác nhận
                    </Button>
                    <Button
                      onClick={() => handleUpdateStatus("CANCELLED")}
                      className="flex-1 text-white hover:opacity-90"
                      style={{ backgroundColor: '#EF5350', color: '#FFFFFF' }}
                    >
                      Hủy
                    </Button>
                  </div>
                </>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Thông tin khác</label>
                <div className="mt-1 space-y-1 text-sm" style={{ color: '#333333' }}>
                  <p>Thời lượng: <span className="font-medium">{selectedBooking.duration} giờ</span></p>
                  {selectedBooking.sessions && (
                    <p>Số buổi: <span className="font-medium">{selectedBooking.sessions} buổi</span></p>
                  )}
                  <p>Giá: <span className="font-medium" style={{ color: '#2C3E50' }}>{selectedBooking.price?.toLocaleString('vi-VN')} VNĐ</span></p>
                </div>
              </div>

              {selectedBooking.original_bookings && selectedBooking.original_bookings.length > 1 && (
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Các phiên liên quan ({selectedBooking.original_bookings.length} phiên)
                  </label>
                  <div className="mt-2 space-y-2">
                    {selectedBooking.original_bookings.map((session, index) => (
                      <div key={index} className="border-t pt-2">
                        <p className="text-sm font-medium" style={{ color: '#333333' }}>
                          Phiên {index + 1}: {new Date(session.start_time).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - {new Date(session.end_time).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${
                          statusConfig[session.session_status]?.badge || "bg-gray-100 text-gray-800"
                        }`}>
                          {statusConfig[session.session_status]?.text || session.session_status}
                        </div>
                        {session.meeting_link && (
                          <div className="mt-1 flex items-center gap-2">
                            <Link className="w-4 h-4 text-gray-500" />
                            <a
                              href={session.meeting_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline truncate text-xs"
                            >
                              {session.meeting_link}
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button
                onClick={() => setSelectedBooking(null)}
                className="w-full text-white hover:opacity-90"
                style={{ backgroundColor: '#F9C5D5', color: '#2C3E50' }}
              >
                Đóng
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};