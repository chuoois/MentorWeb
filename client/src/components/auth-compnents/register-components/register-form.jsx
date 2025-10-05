import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthService from "@/services/auth.service";

export const MenteeRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
        password: formData.password
      };

      const res = await AuthService.register(data);

      if (res?.user?.email_verified === false) {
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.");
      } else {
        toast.success("Đăng ký thành công!");
      }

      navigate("/auth/login"); // chuyển hướng sau đăng ký
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) throw new Error("Không nhận được token từ Google");

      const res = await AuthService.loginWithGoogle(id_token);
      toast.success(`Xin chào ${res.user.full_name || "bạn"}!`);
      navigate("/"); // chuyển hướng sau khi đăng nhập
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập Google bị hủy hoặc lỗi!");
  };

  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold text-[#2C3E50] mb-8 text-center">
        Đăng ký làm mentee
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#2C3E50]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Nhập email của bạn"
            value={formData.email}
            onChange={handleChange}
            required
            className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
          />
        </div>

        {/* Họ và tên */}
        <div className="space-y-2">
          <Label htmlFor="full_name" className="text-sm font-medium text-[#2C3E50]">
            Họ và tên
          </Label>
          <Input
            id="full_name"
            type="text"
            placeholder="Nhập họ và tên của bạn"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
          />
        </div>

        {/* Mật khẩu */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-[#2C3E50]">
            Mật khẩu
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5] pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <ul className="text-xs text-gray-500 mt-1 list-disc ml-5">
            <li>Ít nhất 8 ký tự</li>
            <li>Phải có 1 chữ thường</li>
            <li>Phải có 1 chữ in hoa</li>
            <li>Không được quá phổ biến</li>
          </ul>
        </div>

        {/* Nút đăng ký */}
        <Button
          type="submit"
          className="w-full h-12 bg-[#F9C5D5] hover:bg-[#f5b8cc] text-[#2C3E50] font-medium rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Đang đăng ký..." : "Đăng ký"}
        </Button>
      </form>

      {/* Separator */}
      <div className="relative">
        <Separator className="my-6" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-4 text-sm text-gray-500">Hoặc</span>
        </div>
      </div>

      {/* Google Login */}
      <div className="w-full h-12">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme="outline"
          shape="rectangular"
          size="large"
          width="100%"
        />
      </div>

      {/* Footer */}
      <div className="text-center space-y-3 text-sm mt-6 text-gray-600">
        <p>
          Khi bấm <span className="font-medium">"Đăng ký"</span> hoặc{" "}
          <span className="font-medium">"Đăng ký bằng Google"</span>, bạn đồng ý với{" "}
          <Link to="/terms" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link to="/privacy" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </Link>.
        </p>

        <p>
          Đã có tài khoản?{" "}
          <Link to="/auth/login" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>

        <p>
          Muốn tham gia với vai trò mentor?{" "}
          <Link to="/mentor" className="text-blue-600 hover:underline">
            Ứng tuyển ngay
          </Link>
        </p>
      </div>
    </div>
  );
};
