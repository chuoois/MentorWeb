import { Button } from "@/components/ui/button"
import { Menu, X, GraduationCap } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-[#F9C5D5] backdrop-blur-sm border-b border-[#F9C5D5] z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + tên */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
                <GraduationCap className="w-6 h-6 text-[#2C3E50]" />
              </div>
              <span className="text-2xl font-bold text-[#2C3E50] tracking-tight">
                MentorHub
              </span>
            </Link>
          </div>

          {/* Phần bên phải: Menu + Buttons */}
          <div className="flex items-center space-x-6">
            {/* Menu desktop */}
            <nav className="hidden lg:flex items-center space-x-6">
              <Link
                to="/mentor"
                className="text-[#2C3E50] hover:text-white font-medium transition-colors duration-300"
              >
                Trở thành Mentor
              </Link>
              <Link
                to="/news"
                className="text-[#2C3E50] hover:text-white font-medium transition-colors duration-300"
              >
                Tin tức
              </Link>
            </nav>


            {/* Nút bên phải */}
            <Link to="/auth/login">
              <Button
                variant="outline"
                className="hidden md:inline-flex border border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white font-medium transition-colors duration-300 rounded-full"
              >
                Đăng nhập
              </Button>
            </Link>

            <Button className="bg-[#2C3E50] hover:bg-[#1A2634] text-white px-6 py-2 rounded-full font-medium shadow transition duration-300">
              Xem tất cả Mentor
            </Button>

            {/* Nút toggle menu mobile */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-[#2C3E50] hover:text-white transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-white/50">
            <nav className="flex flex-col space-y-4 pt-4">
              <Link
                to="/mentor"
                className="text-[#2C3E50] hover:text-white font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)} 
              >
                Trở thành Mentor
              </Link>
              <Link
                to="/news"
                className="text-[#2C3E50] hover:text-white font-medium transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Tin tức
              </Link>
            </nav>
          </div>
        )}

      </div>
    </header>
  )
}
