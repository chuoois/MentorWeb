import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, XCircle } from "lucide-react";
import BookingService from "@/services/booking.service";
import { useLocation, useNavigate } from "react-router-dom";

export const PaymentCancelSuccess = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Parse URL query parameters and cancel booking
  useEffect(() => {
    const cancelBooking = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const bookingId = queryParams.get("id");
        const status = queryParams.get("status");
        const orderCode = queryParams.get("orderCode");

        if (!bookingId || status !== "CANCELLED") {
          throw new Error("Thông tin hủy không hợp lệ");
        }

        // Call the cancelBooking API
        const response = await BookingService.cancelBooking(bookingId);
        setBookingData({ bookingId, orderCode, ...response });
      } catch (err) {
        console.error("Error cancelling booking:", err);
        setError(err.message || "Lỗi khi hủy booking");
      } finally {
        setLoading(false);
      }
    };
    cancelBooking();
  }, [location.search]);

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Spinner className="w-12 h-12" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500">Đang xử lý hủy thanh toán...</p>
      </div>
    );
  }

  // 🔹 Error UI
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <XCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
          <p className="text-lg font-medium" style={{ color: "#333333" }}>
            Hủy thanh toán thất bại
          </p>
          <p className="text-gray-400 text-sm mt-2">{error}</p>
          <Button
            className="mt-4"
            style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
            onClick={() => navigate("/")}
          >
            Quay lại trang chủ
          </Button>
        </div>
      </div>
    );
  }

  // 🔹 Success UI
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#F9C5D5" }}>
              <CheckCircle className="w-6 h-6" style={{ color: "#2C3E50" }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#333333" }}>
                Hủy thanh toán thành công
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Booking của bạn đã được hủy thành công.
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold" style={{ color: "#333333" }}>
            Chi tiết hủy booking
          </h3>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Mã Booking</p>
              <p className="text-base font-medium" style={{ color: "#2C3E50" }}>
                {bookingData?.bookingId}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Mã thanh toán</p>
              <p className="text-base font-medium" style={{ color: "#2C3E50" }}>
                {bookingData?.orderCode}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Trạng thái</p>
            <div
              className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 mt-2"
            >
              CANCELLED
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <Button
            style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
            onClick={() => navigate("/mentee/progress")}
          >
            Xem tiến độ học tập
          </Button>
        </div>
      </div>
    </div>
  );
};