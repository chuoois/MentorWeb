import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-[#F9C5D5] border-b border-[#F9C5D5] z-50">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow">
            <GraduationCap className="w-6 h-6 text-[#2C3E50]" />
          </div>
          <span className="text-2xl font-bold text-[#2C3E50] tracking-tight">
            MentorHub
          </span>
        </Link>

        {/* Menu desktop */}
        <nav className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-[#2C3E50] hover:text-white transition-colors font-medium">
            Trang chủ
          </Link>
          <Link to="/listmentor" className="text-[#2C3E50] hover:text-white transition-colors font-medium">
            Xem toàn bộ Mentor
          </Link>
          <Link to="/news" className="text-[#2C3E50] hover:text-white transition-colors font-medium">
            Tin tức
          </Link>
          <Link to="/mentor" className="text-[#2C3E50] hover:text-white transition-colors font-medium">
            Trở thành Mentor
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link to="/auth/login">
            <Button
              variant="outline"
              className="border border-[#2C3E50] text-[#2C3E50] hover:bg-[#2C3E50] hover:text-white rounded-full transition"
            >
              Đăng nhập
            </Button>
          </Link>
          <Link to="/auth/signup">
            <Button className="bg-[#2C3E50] hover:bg-[#1A2634] text-white rounded-full px-6 transition">
              Đăng ký
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 text-[#2C3E50] hover:text-white transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden px-6 pb-4 space-y-4 bg-[#F9C5D5] border-t">
          <Link to="/" className="block text-[#2C3E50] hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>
            Trang chủ
          </Link>
          <Link to="/mentors" className="block text-[#2C3E50] hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>
            Xem toàn bộ Mentor
          </Link>
          <Link to="/news" className="block text-[#2C3E50] hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>
            Tin tức
          </Link>
          <Link to="/mentor" className="block text-[#2C3E50] hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>
            Trở thành Mentor
          </Link>
          <Link to="/auth/login" className="block text-[#2C3E50] hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>
            Đăng nhập
          </Link>
          <Link to="/auth/register" className="block text-[#2C3E50] hover:text-white font-medium" onClick={() => setIsMenuOpen(false)}>
            Đăng ký
          </Link>
        </div>
      )}
    </header>
  )
}
