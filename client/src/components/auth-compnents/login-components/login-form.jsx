import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import AuthService from "@/services/auth.service";

export const LoginForm = () => {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold text-[#2C3E50] mb-8 text-center">
        Đăng nhập
      </h1>

      <Tabs defaultValue="mentee" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="mentee">Tôi là mentee</TabsTrigger>
          <TabsTrigger value="mentor">Tôi là mentor</TabsTrigger>
        </TabsList>

        <TabsContent value="mentee">
          <LoginFormContent type="mentee" />
        </TabsContent>

        <TabsContent value="mentor">
          <LoginFormContent type="mentor" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

/* =================== Form dùng lại =================== */
const LoginFormContent = ({ type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /** 🔹 Submit form login thường */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        email: formData.email.trim(),
        password: formData.password,
      };

      // 🚀 Gọi API đăng nhập
      const res = await AuthService.login(data);

      // 🚫 Kiểm tra sai role thì không lưu token
      if (type === "mentee" && res.user.role !== "MENTEE") {
        throw new Error("Tài khoản này không phải mentee.");
      }
      if (type === "mentor" && res.user.role !== "MENTOR") {
        throw new Error("Tài khoản này không phải mentor.");
      }

      // ✅ Nếu đúng role mới lưu token
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success(`Xin chào ${res.user.full_name || "bạn"}!`);
      navigate(type === "mentor" ? "/mentor/dashboard" : "/");
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message || err.message || "Đăng nhập thất bại!";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /** 🔹 Đăng nhập Google */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) throw new Error("Không nhận được token từ Google");

      const res = await AuthService.loginWithGoogle(id_token);

      // Kiểm tra role
      if (type === "mentor" && res.user.role !== "MENTOR") {
        throw new Error("Tài khoản này không phải mentor.");
      }

      // ✅ Lưu token cho đúng role
      localStorage.setItem("accessToken", res.accessToken);
      localStorage.setItem("refreshToken", res.refreshToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success(`Xin chào ${res.user.full_name || "bạn"}!`);
      navigate(type === "mentor" ? "/mentor/dashboard" : "/");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập Google bị hủy hoặc lỗi!");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor={`${type}-email`} className="text-sm font-medium text-[#2C3E50]">
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

      {/* Mật khẩu */}
      <div className="space-y-2">
        <Label htmlFor={`${type}-password`} className="text-sm font-medium text-[#2C3E50]">
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
            className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5] pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Nút đăng nhập */}
      <Button
        type="submit"
        className="w-full h-12 bg-[#F9C5D5] hover:bg-[#f5b8cc] text-[#2C3E50] font-medium rounded-md transition-colors"
        disabled={isLoading}
      >
        {isLoading
          ? "Đang đăng nhập..."
          : `Đăng nhập với tư cách ${type === "mentee" ? "mentee" : "mentor"}`}
      </Button>

      {/* Google login chỉ cho mentee */}
      {type === "mentee" && (
        <>
          <div className="relative">
            <Separator className="my-6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-white px-4 text-sm text-gray-500">Hoặc</span>
            </div>
          </div>

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
        </>
      )}

      {/* Footer */}
      <div className="text-center space-y-2 text-sm mt-6 text-gray-600">
        <div>
          <Link to="/auth/password_reset" className="text-blue-600 hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
        <div>
          Chưa có tài khoản?{" "}
          <Link to="/auth/signup" className="text-blue-600 hover:underline">
            Đăng ký làm mentee
          </Link>{" "}
          hoặc{" "}
          <Link to="/mentor" className="text-blue-600 hover:underline">
            nộp đơn làm mentor
          </Link>
        </div>
      </div>
    </form>
  );
};
