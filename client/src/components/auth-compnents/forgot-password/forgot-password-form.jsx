import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { Link } from "react-router-dom"

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    // Giả lập gửi link
    await new Promise((resolve) => setTimeout(resolve, 2000))
    toast.success("Liên kết đặt lại mật khẩu đã được gửi tới email của bạn!")
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-[#2C3E50] text-center">
        Đặt lại mật khẩu
      </h1>
      <p className="text-center text-gray-600">
        Nhập địa chỉ email và chúng tôi sẽ gửi cho bạn mật khẩu mới để đăng nhập.
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
          {isLoading ? "Đang gửi..." : "Gửi mật khẩu mới"}
        </Button>
      </form>

      <div className="text-sm text-gray-600">
        <Link to="/auth/login" className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  )
}
