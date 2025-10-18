import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MenteeService from "@/services/mentee.service";

export const MenteeRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Schema validation với Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    full_name: Yup.string().required("Bắt buộc"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Số điện thoại chỉ chứa số")
      .min(8, "Số điện thoại quá ngắn")
      .required("Bắt buộc"),
    password: Yup.string()
      .min(8, "Mật khẩu ít nhất 8 ký tự")
      .matches(/[a-z]/, "Phải có ít nhất 1 chữ thường")
      .matches(/[A-Z]/, "Phải có ít nhất 1 chữ in hoa")
      .required("Bắt buộc"),
  });

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) throw new Error("Không nhận được token từ Google");

      const res = await MenteeService.loginWithGoogle(id_token);
      localStorage.setItem("token", res.token);
      toast.success(`Xin chào ${res.mentee.full_name || "bạn"}!`);
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập Google bị hủy hoặc lỗi!");
  };

  return (
    <div className="w-full space-y-6 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-[#333333] mb-8 text-center tracking-tight">
        Đăng ký làm mentee
      </h1>

      <Formik
        initialValues={{ email: "", full_name: "", phone: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await MenteeService.register(values);
            toast.success("Đăng ký thành công!");
            navigate("/auth/login");
          } catch (err) {
            console.error("Register error:", err);
            const msg =
              err.response?.data?.message ||
              "Đăng ký thất bại, vui lòng thử lại.";
            toast.error(msg);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-[#333333]">
                Email
              </Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                className={`h-12 border rounded-lg w-full px-3 focus:outline-none focus:ring-2 focus:ring-[#F9C5D5] transition-all duration-200 ${isSubmitting ? "opacity-50" : ""} ${validationSchema.fields.email.isValidSync ? "" : "border-red-500"}`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            {/* Họ và tên */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium text-[#333333]">
                Họ và tên
              </Label>
              <Field
                as={Input}
                id="full_name"
                name="full_name"
                placeholder="Nhập họ và tên của bạn"
                className={`h-12 border rounded-lg w-full px-3 focus:outline-none focus:ring-2 focus:ring-[#F9C5D5] transition-all duration-200 ${isSubmitting ? "opacity-50" : ""} ${validationSchema.fields.full_name.isValidSync ? "" : "border-red-500"}`}
              />
              <ErrorMessage
                name="full_name"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-[#333333]">
                Số điện thoại
              </Label>
              <Field
                as={Input}
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại của bạn"
                className={`h-12 border rounded-lg w-full px-3 focus:outline-none focus:ring-2 focus:ring-[#F9C5D5] transition-all duration-200 ${isSubmitting ? "opacity-50" : ""} ${validationSchema.fields.phone.isValidSync ? "" : "border-red-500"}`}
              />
              <ErrorMessage
                name="phone"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#333333]">
                Mật khẩu
              </Label>
              <div className="relative">
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  className={`h-12 border rounded-lg w-full px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F9C5D5] transition-all duration-200 ${isSubmitting ? "opacity-50" : ""} ${validationSchema.fields.password.isValidSync ? "" : "border-red-500"}`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#2C3E50] hover:text-[#F9C5D5] transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <ErrorMessage
                name="password"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              className="w-full h-12 bg-[#F9C5D5] hover:bg-[#f5b8cc] text-[#2C3E50] font-medium rounded-lg transition-colors duration-200 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </Form>
        )}
      </Formik>

      {/* Separator */}
      <div className="relative">
        <Separator className="my-6 bg-gray-200" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-[#FFFFFF] px-4 text-sm text-[#333333]">
            Hoặc
          </span>
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
      <div className="text-center space-y-3 text-sm mt-6 text-[#333333]">
        <p>
          Khi bấm <span className="font-medium">"Đăng ký"</span> hoặc{" "}
          <span className="font-medium">"Đăng ký bằng Google"</span>, bạn đồng ý với{" "}
          <Link to="/terms" className="text-[#2C3E50] hover:text-[#F9C5D5] transition-colors duration-200">
            Điều khoản dịch vụ
          </Link>{" "}
          và{" "}
          <Link to="/privacy" className="text-[#2C3E50] hover:text-[#F9C5D5] transition-colors duration-200">
            Chính sách bảo mật
          </Link>.
        </p>

        <p>
          Đã có tài khoản?{" "}
          <Link to="/auth/login" className="text-[#2C3E50] hover:text-[#F9C5D5] transition-colors duration-200">
            Đăng nhập
          </Link>
        </p>

        <p>
          Muốn tham gia với vai trò mentor?{" "}
          <Link to="/mentor" className="text-[#2C3E50] hover:text-[#F9C5D5] transition-colors duration-200">
            Ứng tuyển ngay
          </Link>
        </p>
      </div>
    </div>
  );
};