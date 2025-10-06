import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthService from "@/services/auth.service";

export const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const hasVerified = useRef(false); // ✅ Dùng useRef thay vì biến local

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/auth/login");
      return;
    }

    // ✅ Chỉ verify 1 lần duy nhất
    if (hasVerified.current) {
      console.log("⚠️ Already verified, skipping...");
      return;
    }

    const verify = async () => {
      hasVerified.current = true; // ✅ Đánh dấu ngay trước khi gọi API

      try {
        console.log("📤 Sending token:", token);
        await AuthService.verifyEmail(token);
        setTimeout(() => navigate("/auth/login"), 5000);
      } catch (error) {
        console.error("❌ verifyEmail error:", error.response?.data);
        setTimeout(() => navigate("/auth/login"), 5000);
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <div className="mx-auto mb-4 w-20 h-20 flex items-center justify-center rounded-full bg-green-500 text-white text-4xl font-bold">
          ✓
        </div>
        <h2 className="text-2xl font-bold text-green-600 mb-2">
          Xác thực thành công!
        </h2>
        <p className="text-gray-600 mb-3">
          Bạn sẽ được chuyển đến trang đăng nhập trong giây lát...
        </p>
      </div>
    </div>
  );
};