import { BookOpen, FileText, Settings, LogOut, X, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link, useLocation, useNavigate } from "react-router-dom"

const navigation = [
  { name: "Đơn ứng tuyển", icon: FileText, path: "/applications" },
  { name: "Tiến độ", icon: BookOpen, path: "/progress" },
  { name: "Lịch hẹn", icon: CalendarDays, path: "/schedule" },
]

export const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const currentPath = location.pathname
  const navigate = useNavigate()

  const handleLogout = () => {
    // Xóa thông tin đăng nhập (tùy cách bạn lưu)
    localStorage.removeItem("token")
    sessionStorage.clear()

    // Chuyển hướng về trang đăng nhập
    navigate("/mentor")
  }

  return (
    <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">M</span>
            </div>
            <div>
              <h1 className="font-semibold text-sidebar-foreground">MentorHub</h1>
              <p className="text-xs text-muted-foreground">Bảng điều khiển</p>
            </div>
          </div>
          {/* Nút đóng trên mobile */}
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = currentPath === item.path
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-3 h-10",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Nút đăng xuất */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-red-500 hover:bg-red-100"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </Button>
      </div>
    </div>
  )
}
