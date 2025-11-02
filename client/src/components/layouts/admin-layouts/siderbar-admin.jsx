import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  LogOut 
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Quản lý mentor", icon: Users, path: "/admin/mentors" },
  { name: "Quản lý mentee", icon: UserPlus, path: "/admin/mentees" },
]

export const Sidebar = () => {
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    window.location.href = "/auth/adminlogin"
  }

  return (
    <aside className="h-screen w-64 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100 shadow-lg flex flex-col transition-all duration-300">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center border-b border-gray-100">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Admin Panel
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-blue-500/10 text-blue-600 font-semibold shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors duration-200",
                isActive ? "text-blue-600" : "text-gray-500"
              )} />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2 justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 border-gray-200 hover:border-red-200"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  )
}