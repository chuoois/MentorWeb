import { MessageCircle, FileText, Settings, User, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Link, useLocation } from "react-router-dom"

const navigation = [
  { name: "Trò chuyện", icon: MessageCircle, path: "/chat" },
  { name: "Đơn ứng tuyển", icon: FileText, path: "/applications" },
  { name: "Cài đặt", icon: Settings, path: "/settings" },
]

export const Sidebar = ({ onClose }) => {
  const location = useLocation()
  const currentPath = location.pathname

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

      {/* Hồ sơ người dùng */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder.svg?key=fdqic" />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              TS. Sarah Johnson
            </p>
            <p className="text-xs text-muted-foreground truncate">Cố vấn cao cấp</p>
          </div>
        </div>
      </div>
    </div>
  )
}
