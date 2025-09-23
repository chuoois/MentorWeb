import { Button } from "@/components/ui/button"
import { GraduationCap } from "lucide-react"
import { Link } from "react-router-dom"

export const MentorApplicationSubmitted = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-8 bg-white">
      {/* Container chính */}
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow">
            <GraduationCap className="w-7 h-7 text-[#2C3E50]" />
          </div>
          <span className="text-2xl font-bold text-[#2C3E50] tracking-tight">
            MentorHub
          </span>
        </div>

        {/* Nội dung */}
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">
            Cảm ơn bạn đã đăng ký trở thành mentor!
          </h1>
          <p className="text-gray-700 leading-relaxed">
            Chúng tôi sẽ xem xét đơn đăng ký của bạn và phản hồi sớm nhất có thể.
            Thông thường, bạn sẽ nhận được kết quả trong vòng{" "}
            <span className="font-medium">5–10 ngày làm việc</span>.
            <br />
            <br />
            Bạn sẽ nhận được email tại địa chỉ đã đăng ký với các bước tiếp theo.
          </p>

          {/* Tiếp theo */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-[#2C3E50]">
              Tiếp theo là gì?
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Trong thời gian chờ, bạn có thể chuẩn bị trước các bước để trở thành một mentor.
              Điều này không bắt buộc nhưng sẽ giúp bạn bắt đầu nhanh hơn.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Đọc các hướng dẫn dành cho mentor</li>
              <li>Đăng ký nhận bản tin</li>
              <li>Tham khảo hồ sơ của các mentor khác để lấy cảm hứng</li>
            </ul>
          </div>

          {/* Nút trở về */}
          <div className="pt-4">
            <Link to="/">
              <Button
                variant="outline"
                className="rounded-full border border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white transition-colors duration-300"
              >
                ← Quay lại Trang chủ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
