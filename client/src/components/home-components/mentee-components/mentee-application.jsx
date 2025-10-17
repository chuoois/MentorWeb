import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import BookingService from "@/services/booking.service";

export const MenteeApplication = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    totalPages: 1,
  });

  // Fetch booking status
  const fetchBookingStatus = async (page = 1) => {
    try {
      setLoading(true);
      const response = await BookingService.getBookingStatusByMenteeId({
        page,
        limit: pagination.limit,
      });
      setBookings(response.data || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Lỗi khi tải booking:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchBookingStatus();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-40 space-y-2">
        <Spinner className="w-7 h-7" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500 text-xs">Đang tải trạng thái đăng ký...</p>
      </div>
    );
  }

  // Empty bookings
  if (!bookings.length) {
    return (
      <div className="text-center py-5 bg-white rounded-md shadow-sm border border-gray-200 mt-2">
        <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-medium" style={{ color: "#333333" }}>
          Không tìm thấy đăng ký nào
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Bạn chưa có đăng ký nào hoặc vui lòng kiểm tra lại
        </p>
      </div>
    );
  }

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBookingStatus(newPage);
    }
  };

  return (
    <div className="max-w-[90vw] mx-auto p-2">
      {/* Header */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md" style={{ backgroundColor: "#F9C5D5" }}>
              <Calendar className="w-4 h-4" style={{ color: "#2C3E50" }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "#333333" }}>
                Trạng thái đăng ký
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Xem và quản lý trạng thái các đăng ký của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="border-b border-gray-200 pb-4 last:border-b-0"
            >
              {/* Booking Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 rounded-md ${
                      booking.status === "CONFIRMED"
                        ? "bg-green-100"
                        : booking.status === "CANCELLED"
                        ? "bg-red-100"
                        : booking.status === "COMPLETED"
                        ? "bg-blue-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    {booking.status === "CONFIRMED" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : booking.status === "CANCELLED" ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : booking.status === "COMPLETED" ? (
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#333333" }}>
                      Đăng ký #{booking.bookingId}
                    </p>
                    <p className="text-xs text-gray-500">
                      Mentor: {booking.mentor.fullName || "Chưa chỉ định mentor"}
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    booking.status === "CONFIRMED"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "CANCELLED"
                      ? "bg-red-100 text-red-700"
                      : booking.status === "COMPLETED"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {booking.status === "CONFIRMED"
                    ? "Đã xác nhận"
                    : booking.status === "CANCELLED"
                    ? "Đã hủy"
                    : booking.status === "COMPLETED"
                    ? "Đã hoàn thành"
                    : "Đang chờ xử lý"}
                </div>
              </div>

              {/* Booking Details */}
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Info label="Thời gian đăng ký">
                  {new Date(booking.createdAt).toLocaleString("vi-VN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Info>
                <Info label="Lĩnh vực">{booking.mentor.category}</Info>
                <Info label="Giá">
                  {booking.price
                    ? `${booking.price.toLocaleString("vi-VN")} VND`
                    : "Chưa cung cấp"}
                </Info>
                <Info label="Thời lượng">
                  {booking.duration ? `${booking.duration} giờ` : "Chưa cung cấp"}
                </Info>
                <Info label="Số buổi">{booking.sessions}</Info>
                <Info label="Kỹ năng">{booking.mentor.skill}</Info>
              </div>

              {/* Session Times */}
              {booking.sessionTimes?.length > 0 && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-gray-500">
                    Lịch buổi học
                  </label>
                  <div className="mt-1 space-y-2">
                    {booking.sessionTimes.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-gray-50 p-2 rounded-md"
                      >
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm" style={{ color: "#333333" }}>
                            {new Date(session.startTime).toLocaleString("vi-VN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}{" "}
                            -{" "}
                            {new Date(session.endTime).toLocaleString("vi-VN", {
                              timeStyle: "short",
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            Trạng thái:{" "}
                            {session.status === "UPCOMING"
                              ? "Sắp diễn ra"
                              : session.status === "COMPLETED"
                              ? "Đã hoàn thành"
                              : "Đã hủy"}
                          </p>
                          {session.meetingLink && (
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:underline"
                            >
                              Link buổi học
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cancel Reason */}
              {booking.cancelReason && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-gray-500">
                    Lý do hủy
                  </label>
                  <p className="text-sm bg-red-50 p-2 rounded-md mt-0.5" style={{ color: "#333333" }}>
                    {booking.cancelReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
              className="text-xs px-2"
            >
              <ChevronLeft className="w-3 h-3 mr-1" />
              Trang trước
            </Button>
            <span className="text-xs text-gray-600">
              Trang {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => handlePageChange(pagination.page + 1)}
              className="text-xs px-2"
            >
              Trang sau
              <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// Info Component
const Info = ({ label, children }) => (
  <div>
    <label className="text-xs font-medium text-gray-500">{label}</label>
    <p className="text-sm" style={{ color: "#333333" }}>
      {children || "Chưa cung cấp"}
    </p>
  </div>
);