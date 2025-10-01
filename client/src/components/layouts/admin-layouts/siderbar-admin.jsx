import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  UserPlus, 
  LogOut 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Thống kê", icon: LayoutDashboard, path: "/admin/dashboard" },
  { name: "Đơn ứng tuyển mentor", icon: UserCheck, path: "/admin/applications" },
  { name: "Quản lý mentor", icon: Users, path: "/admin/mentors" },
  { name: "Quản lý mentee", icon: UserPlus, path: "/admin/mentees" },
]

export const Sidebar = () => {
  const location = useLocation()

  const handleLogout = () => {
    console.log("User logged out")
  }

  return (
    <aside className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  )
}
