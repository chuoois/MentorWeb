import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"

export const MenteeRegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast.success("Đăng ký thành công!")
    setIsLoading(false)
  }

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
            required
            className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
          />
        </div>

        {/* Họ và tên */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm font-medium text-[#2C3E50]">
            Họ và tên
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Nhập họ và tên của bạn"
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
              required
              minLength={8}
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

      {/* Đăng ký Google */}
      <Button
        variant="outline"
        className="w-full h-12 border border-gray-300 hover:bg-gray-50 transition-colors bg-transparent flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Đăng ký bằng Google
      </Button>

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
  )
}
