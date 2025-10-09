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
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MenteeService from "@/services/mentee.service";
import MentorService from "@/services/mentor.service";

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

const LoginFormContent = ({ type }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Yup schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
    password: Yup.string().min(6, "Mật khẩu ít nhất 6 ký tự").required("Bắt buộc"),
  });

  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      const data = {
        email: values.email.trim(),
        password: values.password,
      };

      // Gọi API đăng nhập
      const res =
        type === "mentee"
          ? await MenteeService.login(data)
          : await MentorService.login(data);

      // Lưu token
      localStorage.setItem("token", res.token);
      // Lưu thông tin người dùng
      const currentUser = type === "mentee" ? res.mentee : res.mentor;
      console.log(currentUser);

      // Toast
      toast.success(`Xin chào ${currentUser.full_name || "bạn"}!`);

      // Chuyển hướng dựa trên vai trò người dùng
      if (currentUser.role === "MENTOR") {
        navigate("/applications"); // Trang dành cho mentor
      } else {
        navigate("/"); // Trang dành cho mentee
      }
    } catch (err) {
      console.error("Login error:", err);
      const msg =
        err.response?.data?.message || err.message || "Đăng nhập thất bại!";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  /** Google login (chỉ cho mentee) */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const id_token = credentialResponse?.credential;
      if (!id_token) throw new Error("Không nhận được token từ Google");

      const res = await MenteeService.loginWithGoogle(id_token);

      // Lưu token
      localStorage.setItem("token", res.token);

      // Lưu thông tin mentee
      const currentUser = res.mentee;

      toast.success(`Xin chào ${currentUser.full_name || "bạn"}!`);
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      toast.error("Đăng nhập Google thất bại!");
    }
  };

  const handleGoogleError = () => toast.error("Đăng nhập Google bị hủy hoặc lỗi!");

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="space-y-4">
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[#2C3E50]">
              Email
            </Label>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Nhập email của bạn"
              className={`h-12 border rounded-md w-full px-3 focus:outline-none focus:ring-1 ${errors.email && touched.email
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-[#F9C5D5]"
                }`}
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#2C3E50]">
              Mật khẩu
            </Label>
            <div className="relative">
              <Field
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className={`h-12 border rounded-md w-full px-3 pr-10 focus:outline-none focus:ring-1 ${errors.password && touched.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#F9C5D5]"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Submit button */}
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
        </Form>
      )}
    </Formik>
  );
};
