import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import MentorService from "@/services/mentor.service"; // hoặc MentorService nếu bạn tách riêng

export const MentorAvailabilitySettings = () => {
  const [availability, setAvailability] = useState({ startTime: 8, endTime: 18 });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // ✅ Gọi API getAvailability khi load component
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoading(true);
      try {
        const res = await MentorService.getAvailability(); // API: GET /api/mentors/availability
        if (res?.availability) {
          setAvailability(res.availability);
        }
      } catch (err) {
        console.error("Lỗi khi tải availability:", err);
        setError("Không thể tải dữ liệu thời gian khả dụng.");
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, []);

  // ✅ Submit cập nhật availability
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { startTime, endTime } = availability;

    // Validate dữ liệu đầu vào
    if (startTime < 0 || startTime > 23 || endTime < 1 || endTime > 24) {
      setError("Giờ phải nằm trong khoảng 0–23.");
      return;
    }
    if (startTime >= endTime) {
      setError("Giờ bắt đầu phải nhỏ hơn giờ kết thúc.");
      return;
    }

    setLoading(true);
    try {
      const res = await MentorService.updateAvailability({
        startTime: Number(startTime),
        endTime: Number(endTime),
      }); // API: PUT /api/mentors/availability
      console.log("Cập nhật thành công:", res);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
      setError(err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[90vw] mx-auto p-2">
      {/* Header */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3 mb-2">
        <div className="flex items-center gap-1.5">
          <div className="p-1 rounded-md" style={{ backgroundColor: "#F9C5D5" }}>
            <Clock className="w-4 h-4" style={{ color: "#2C3E50" }} />
          </div>
          <div>
            <h2 className="text-base font-bold" style={{ color: "#333333" }}>
              Cài đặt thời gian khả dụng
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Cập nhật khung giờ bạn có thể nhận lịch học
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200 p-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-700">
                Giờ bắt đầu
              </label>
              <select
                value={availability.startTime}
                onChange={(e) =>
                  setAvailability({
                    ...availability,
                    startTime: Number(e.target.value),
                  })
                }
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
                style={{ backgroundColor: "#FAFAFA" }}
                disabled={loading}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {i.toString().padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">
                Giờ kết thúc
              </label>
              <select
                value={availability.endTime}
                onChange={(e) =>
                  setAvailability({
                    ...availability,
                    endTime: Number(e.target.value),
                  })
                }
                className="mt-1 w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-200"
                style={{ backgroundColor: "#FAFAFA" }}
                disabled={loading}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {(i + 1).toString().padStart(2, "0")}:00
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Hiển thị thời gian hiện tại */}
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-xs text-gray-500">Khung giờ hiện tại</p>
            <p className="text-sm font-semibold" style={{ color: "#2C3E50" }}>
              {availability.startTime.toString().padStart(2, "0")}:00 -{" "}
              {availability.endTime.toString().padStart(2, "0")}:00
            </p>
          </div>

          {/* Thông báo */}
          {error && (
            <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <p className="text-xs text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-700">Cập nhật thành công!</p>
            </div>
          )}

          {/* Nút submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2 text-sm font-medium"
            style={{
              backgroundColor: loading ? "#cccccc" : "#F9C5D5",
              color: "#2C3E50",
            }}
          >
            {loading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" style={{ color: "#2C3E50" }} />
                Đang xử lý...
              </>
            ) : (
              "Cập nhật thời gian"
            )}
          </Button>
        </form>
      </div>

      {/* Ghi chú */}
      <div className="mt-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p>
          <strong>Lưu ý:</strong> Thời gian được tính theo múi giờ{" "}
          <span className="font-medium">Asia/Ho_Chi_Minh (GMT+7)</span>. Học viên chỉ có thể đặt lịch trong khung giờ bạn cho phép.
        </p>
      </div>
    </div>
  );
};
