import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import BookingService from "@/services/booking.service";

export const MenteeApplication = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingStatus = async () => {
      try {
        setLoading(true);
        const response = await BookingService.getBookingStatusByMenteeId();
        setBookings(response.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookingStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Spinner className="w-12 h-12" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500">Đang tải trạng thái đăng ký...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200 mt-6">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-lg font-medium" style={{ color: "#333333" }}>
          Không tìm thấy đăng ký nào
        </p>
        <p className="text-gray-400 text-sm mt-2">
          Bạn chưa có đăng ký nào hoặc vui lòng kiểm tra lại
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#F9C5D5" }}>
              <Calendar className="w-6 h-6" style={{ color: "#2C3E50" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>
                Trạng thái đăng ký
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Xem và quản lý trạng thái các đăng ký của bạn
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="border-b border-gray-200 pb-6 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
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
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : booking.status === "CANCELLED" ? (
                      <XCircle className="w-5 h-5 text-red-600" />
                    ) : booking.status === "COMPLETED" ? (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="text-base font-medium" style={{ color: "#333333" }}>
                      Đăng ký #{booking.bookingId}
                    </p>
                    <p className="text-sm text-gray-500">
                      Mentor: {booking.mentor.fullName || "Chưa chỉ định mentor"}
                    </p>
                  </div>
                </div>

                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
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

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Thời gian đăng ký
                  </label>
                  <p className="text-base" style={{ color: "#333333" }}>
                    {booking.createdAt
                      ? new Date(booking.createdAt).toLocaleString("vi-VN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Chưa cung cấp"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Lĩnh vực
                  </label>
                  <p className="text-base" style={{ color: "#333333" }}>
                    {booking.mentor.category || "Chưa cung cấp"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Giá
                  </label>
                  <p className="text-base" style={{ color: "#333333" }}>
                    {booking.price
                      ? `${booking.price.toLocaleString("vi-VN")} VND`
                      : "Chưa cung cấp"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Thời lượng
                  </label>
                  <p className="text-base" style={{ color: "#333333" }}>
                    {booking.duration ? `${booking.duration} giờ` : "Chưa cung cấp"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Số buổi
                  </label>
                  <p className="text-base" style={{ color: "#333333" }}>
                    {booking.sessions || "Chưa cung cấp"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Kỹ năng
                  </label>
                  <p className="text-base" style={{ color: "#333333" }}>
                    {booking.mentor.skill || "Chưa cung cấp"}
                  </p>
                </div>
              </div>

              {booking.sessionTimes && booking.sessionTimes.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500">
                    Lịch buổi học
                  </label>
                  <div className="mt-2 space-y-2">
                    {booking.sessionTimes.map((session, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg"
                      >
                        <Calendar className="w-5 h-5 text-gray-500" />
                        <div>
                          <p className="text-base" style={{ color: "#333333" }}>
                            {new Date(session.startTime).toLocaleString("vi-VN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}{" "}
                            -{" "}
                            {new Date(session.endTime).toLocaleString("vi-VN", {
                              timeStyle: "short",
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
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
                              className="text-sm text-blue-600 hover:underline"
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

              {booking.cancelReason && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-500">
                    Lý do hủy
                  </label>
                  <p className="text-base bg-red-50 p-3 rounded-lg" style={{ color: "#333333" }}>
                    {booking.cancelReason}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
