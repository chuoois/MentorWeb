import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, XCircle } from "lucide-react";
import BookingService from "@/services/booking.service";
import OtherService from "@/services/other.service"; // Import OtherService để gọi webhook
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const PaymentResult = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false); // Biến để xác định trạng thái thành công
  const location = useLocation();
  const navigate = useNavigate();

  // 🔹 Parse URL query parameters và xử lý thanh toán hoặc hủy
  useEffect(() => {
    const processPaymentResult = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams(location.search);
        const bookingId = queryParams.get("id");
        const status = queryParams.get("status");
        const orderCode = queryParams.get("orderCode");
        const success = queryParams.get("success") === "true";
        const amount = queryParams.get("amount");

        if (!bookingId) {
          throw new Error("Thiếu mã booking");
        }

        if (success) {
          // Xử lý thanh toán thành công
          setIsSuccess(true);
          setBookingData({ bookingId, orderCode, amount: parseInt(amount) || 0 });

          // Gọi webhook cho thanh toán thành công
          const webhookPayload = {
            data: {
              orderCode: orderCode || bookingId,
              status: "PAID",
              amount: parseInt(amount) || 0,
            },
            signature: "fake_signature_for_test", // Thay bằng signature thực nếu có
          };

          try {
            await OtherService.sendWebhook(webhookPayload);
            toast.success("Webhook thanh toán đã được gửi!");
          } catch (webhookError) {
            console.error("Webhook error:", webhookError);
            toast.error("Lỗi khi gửi webhook thanh toán");
          }
        } else if (status === "CANCELLED") {
          // Xử lý hủy thanh toán
          setIsSuccess(false);
          const response = await BookingService.cancelBooking(bookingId);
          setBookingData({ bookingId, orderCode, ...response });
        } else {
          throw new Error("Trạng thái thanh toán không hợp lệ");
        }
      } catch (err) {
        console.error("Error processing payment result:", err);
        setError(err.message || "Lỗi khi xử lý kết quả thanh toán");
      } finally {
        setLoading(false);
      }
    };
    processPaymentResult();
  }, [location.search]);

  // 🔹 Loading UI
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <Spinner className="w-12 h-12" style={{ color: "#F9C5D5" }} />
        <p className="text-gray-500">Đang xử lý kết quả thanh toán...</p>
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
            Xử lý thanh toán thất bại
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

  // 🔹 Success UI (Thanh toán thành công hoặc Hủy)
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
                {isSuccess ? "Thanh toán thành công" : "Hủy thanh toán thành công"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {isSuccess
                  ? "Booking của bạn đã được xác nhận. Cảm ơn bạn đã sử dụng dịch vụ!"
                  : "Booking của bạn đã được hủy thành công."}
              </p>
            </div>
          </div>
        </div>

        {/* Booking Details */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold" style={{ color: "#333333" }}>
            {isSuccess ? "Chi tiết booking" : "Chi tiết hủy booking"}
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
                {bookingData?.orderCode || "N/A"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Trạng thái</p>
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${isSuccess ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}
            >
              {isSuccess ? "PAID" : "CANCELLED"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-4">
          <Button
            style={{ backgroundColor: "#F9C5D5", color: "#2C3E50" }}
            onClick={() => navigate("/mentee/progress")}
          >
            Xem tiến độ học tập
          </Button>
          {isSuccess && (
            <Button
              variant="outline"
              style={{ borderColor: "#F9C5D5", color: "#2C3E50" }}
              onClick={() => navigate("/listmentor")}
            >
              Đặt thêm lịch
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};