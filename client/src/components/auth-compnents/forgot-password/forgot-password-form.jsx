import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"
import AuthService from "@/services/auth.service"

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      toast.error("Vui lòng nhập email hợp lệ!")
      return
    }

    setIsLoading(true)
    try {
      const res = await AuthService.forgotPassword(email.trim())
      toast.success(res.message || "Liên kết đặt lại mật khẩu đã được gửi tới email của bạn!")
    } catch (err) {
      console.error("Forgot password error:", err)
      const msg = err.response?.data?.message || "Không thể gửi email đặt lại mật khẩu!"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[#2C3E50] text-center">
        Đặt lại mật khẩu
      </h1>
      <p className="text-center text-gray-600">
        Nhập địa chỉ email và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-[#2C3E50]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            required
            className="h-12 border border-gray-300 rounded-md focus:border-[#F9C5D5] focus:ring-1 focus:ring-[#F9C5D5]"
          />
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#F9C5D5] hover:bg-[#f5b8cc] text-[#2C3E50] font-medium rounded-md transition-colors"
          disabled={isLoading}
        >
          {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại mật khẩu"}
        </Button>
      </form>

      <div className="text-sm text-gray-600 text-center">
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  )
}
