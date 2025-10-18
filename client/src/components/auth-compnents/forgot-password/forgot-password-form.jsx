import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import AuthService from "@/services/mentee.service";

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Vui lòng nhập email hợp lệ!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await AuthService.forgotPassword({ email });
      toast.success(res.message || "Liên kết đặt lại mật khẩu đã được gửi tới email của bạn!");
    } catch (err) {
      console.error("Forgot password error:", err);
      const msg = err.response?.data?.message || "Không thể gửi email đặt lại mật khẩu!";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-6 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-[#333333] text-center tracking-tight">
        Đặt lại mật khẩu
      </h1>
      <p className="text-center text-[#333333] text-sm">
        Nhập địa chỉ email và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#333333]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            className={`h-12 border rounded-lg w-full px-3 focus:outline-none focus:ring-2 focus:ring-[#F9C5D5] transition-all duration-200 ${isLoading ? "opacity-50" : ""} ${email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "border-red-500" : "border-gray-300"}`}
          />
          {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
            <div className="text-xs text-red-500 mt-1">Email không hợp lệ</div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#F9C5D5] hover:bg-[#f5b8cc] text-[#2C3E50] font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : null}
          {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
        </Button>
      </form>

      <div className="text-sm text-[#333333] text-center">
        <Link to="/auth/login" className="text-[#2C3E50] hover:text-[#F9C5D5] transition-colors duration-200">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};