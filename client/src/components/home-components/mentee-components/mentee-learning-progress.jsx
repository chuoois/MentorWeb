import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { User, Calendar, CheckCircle, Clock, BookOpen } from "lucide-react";
import BookingService from "@/services/booking.service";

export const LearningProgress = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch learning progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        const response = await BookingService.getLearningProgress();
        setProgressData(response.data);
        console.log("Learning progress data:", response.data);
      } catch (error) {
        console.error("Error fetching learning progress:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  // Loading UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-40 space-y-2">
        <Spinner className="w-7 h-7" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500 text-xs">Đang tải tiến độ học tập...</p>
      </div>
    );
  }

  // Empty progress data
  if (!progressData) {
    return (
      <div className="text-center py-5 bg-white rounded-md shadow-sm border border-gray-200 mt-2">
        <BookOpen className="w-8 h-8 text-gray-300 mx-auto mb-2" />
        <p className="text-sm font-medium" style={{ color: "#333333" }}>
          Không tìm thấy tiến độ học tập
        </p>
        <p className="text-gray-400 text-xs mt-1">
          Vui lòng kiểm tra lại hoặc liên hệ hỗ trợ
        </p>
      </div>
    );
  }

  // Main UI
  return (
    <div className="max-w-[90vw] mx-auto p-2">
      {/* Header */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="p-1 rounded-md" style={{ backgroundColor: "#F9C5D5" }}>
              <BookOpen className="w-4 h-4" style={{ color: "#2C3E50" }} />
            </div>
            <div>
              <h2 className="text-base font-bold" style={{ color: "#333333" }}>
                Tiến độ học tập
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Xem tiến độ học tập của bạn với các mentor
              </p>
            </div>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-3">
          <h3 className="text-sm font-semibold" style={{ color: "#333333" }}>
            Tổng quan tiến độ
          </h3>
          <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Tổng số booking</p>
              <p className="text-lg font-bold" style={{ color: "#2C3E50" }}>
                {progressData.overallProgress.totalBookings}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Tổng số buổi học</p>
              <p className="text-lg font-bold" style={{ color: "#2C3E50" }}>
                {progressData.overallProgress.totalSessions}
              </p>
            </div>
            <div className="bg-gray-50 p-2 rounded-md">
              <p className="text-xs text-gray-500">Buổi đã hoàn thành</p>
              <p className="text-lg font-bold" style={{ color: "#2C3E50" }}>
                {progressData.overallProgress.totalCompletedSessions}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-xs text-gray-500">Phần trăm hoàn thành</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${progressData.overallProgress.overallProgressPercentage}%`,
                  backgroundColor: "#F9C5D5",
                }}
              ></div>
            </div>
            <p className="text-xs font-medium mt-1" style={{ color: "#2C3E50" }}>
              {progressData.overallProgress.overallProgressPercentage}% hoàn thành
            </p>
          </div>
        </div>
      </div>

      {/* Booking List */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
        <h3 className="text-sm font-semibold mb-2" style={{ color: "#333333" }}>
          Chi tiết các booking
        </h3>
        {progressData.bookings.map((booking) => (
          <div
            key={booking.bookingId}
            className="border-b border-gray-200 py-2 last:border-b-0"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={booking.mentor.avatarUrl || "https://via.placeholder.com/40"}
                  alt={booking.mentor.fullName}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium" style={{ color: "#333333" }}>
                    {booking.mentor.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {booking.mentor.jobTitle} tại {booking.mentor.company}
                  </p>
                </div>
              </div>
              <div
                className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                  booking.status === "COMPLETED"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "CONFIRMED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {booking.status === "COMPLETED"
                  ? "Hoàn thành"
                  : booking.status === "CONFIRMED"
                  ? "Đã xác nhận"
                  : "Chờ xác nhận"}
              </div>
            </div>

            {/* Booking Details */}
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <p className="text-xs text-gray-500">Tổng số buổi</p>
                <p className="text-sm font-medium" style={{ color: "#2C3E50" }}>
                  {booking.totalSessions}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Buổi đã hoàn thành</p>
                <p className="text-sm font-medium" style={{ color: "#2C3E50" }}>
                  {booking.completedSessions}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phần trăm hoàn thành</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                  <div
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${booking.progressPercentage}%`,
                      backgroundColor: "#F9C5D5",
                    }}
                  ></div>
                </div>
                <p className="text-xs font-medium mt-1" style={{ color: "#2C3E50" }}>
                  {booking.progressPercentage}% hoàn thành
                </p>
              </div>
            </div>

            {/* Session Details */}
            <div className="mt-2">
              <p className="text-xs font-medium text-gray-500">Chi tiết các buổi học</p>
              <div className="mt-1 space-y-2">
                {booking.sessionDetails.map((session, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
                  >
                    <div
                      className={`p-1.5 rounded-md ${
                        session.status === "COMPLETED"
                          ? "bg-green-100"
                          : session.status === "UPCOMING"
                          ? "bg-blue-100"
                          : "bg-gray-100"
                      }`}
                    >
                      {session.status === "COMPLETED" ? (
                        <CheckCircle className="w-4 h-4 text-green-700" />
                      ) : (
                        <Clock className="w-4 h-4 text-blue-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium" style={{ color: "#333333" }}>
                        {new Date(session.startTime).toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })}
                        {" - "}
                        {new Date(session.endTime).toLocaleString("vi-VN", {
                          timeZone: "Asia/Ho_Chi_Minh",
                          timeStyle: "short",
                        })}
                      </p>
                      <p className="text-xs text-gray-500">
                        Trạng thái: {session.status === "COMPLETED" ? "Hoàn thành" : "Sắp tới"}
                      </p>
                      {session.meetingLink && (
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline"
                        >
                          Link Google Meet
                        </a>
                      )}
                      {session.mentorNote && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          <span className="font-medium">Ghi chú từ mentor:</span>{" "}
                          {session.mentorNote}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {booking.note && (
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-500">Ghi chú booking</p>
                <p className="text-xs bg-gray-50 p-2 rounded-md mt-0.5" style={{ color: "#333333" }}>
                  {booking.note}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};