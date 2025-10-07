import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import MenteeService from "@/services/mentee.service";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
    <div className="w-full space-y-6">
      <h1 className="text-3xl font-bold text-[#2C3E50] mb-8 text-center">
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
              <Label htmlFor="email" className="text-sm font-medium text-[#2C3E50]">
                Email
              </Label>
              <Field
                as={Input}
                id="email"
                name="email"
                type="email"
                placeholder="Nhập email của bạn"
                className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
              />
              <ErrorMessage name="email" component="div" className="text-xs text-red-500" />
            </div>

            {/* Họ và tên */}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-medium text-[#2C3E50]">
                Họ và tên
              </Label>
              <Field
                as={Input}
                id="full_name"
                name="full_name"
                placeholder="Nhập họ và tên của bạn"
                className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
              />
              <ErrorMessage name="full_name" component="div" className="text-xs text-red-500" />
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-[#2C3E50]">
                Số điện thoại
              </Label>
              <Field
                as={Input}
                id="phone"
                name="phone"
                placeholder="Nhập số điện thoại của bạn"
                className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
              />
              <ErrorMessage name="phone" component="div" className="text-xs text-red-500" />
            </div>

            {/* Mật khẩu */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-[#2C3E50]">
                Mật khẩu
              </Label>
              <div className="relative">
                <Field
                  as={Input}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5] pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <ErrorMessage name="password" component="div" className="text-xs text-red-500" />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#F9C5D5] hover:bg-[#f5b8cc] text-[#2C3E50] font-medium rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
            </Button>
          </Form>
        )}
      </Formik>

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
