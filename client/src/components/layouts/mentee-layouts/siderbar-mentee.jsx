import { NavLink, Link } from "react-router-dom";
import {
  Home,
  Users,
  BookOpen,
  Calendar,
  User,
  GraduationCap,
  CreditCard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Sidebar = () => {
  const tabs = [
    { path: "/mentee/applications", label: "Đơn xét duyệt", icon: <Users className="w-4 h-4" /> },
    { path: "/mentee/progress", label: "Tiến độ học tập", icon: <BookOpen className="w-4 h-4" /> },
    { path: "/mentee/schedule", label: "Lịch học", icon: <Calendar className="w-4 h-4" /> },
    { path: "/mentee/transactions", label: "Lịch sử giao dịch", icon: <CreditCard className="w-4 h-4" /> },
    { path: "/mentee/profile", label: "Hồ sơ", icon: <User className="w-4 h-4" /> },
    { path: "/", label: "Quay lại trang chủ", icon: <Home className="w-4 h-4" /> },
  ];

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 flex flex-col border-r shadow-sm"
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: "#F3F3F3",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-6 py-4 border-b"
        style={{
          borderColor: "#F3F3F3",
          background: "linear-gradient(135deg, #F9C5D5, #FEECEB)",
          color: "#2C3E50",
        }}
      >
        <GraduationCap className="w-6 h-6" />
        <Link to="/">
          <h1 className="text-lg font-semibold">Mentee Dashboard</h1>
        </Link>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#F3F3F3]">
        <Avatar className="w-10 h-10 border">
          <AvatarImage src="https://i.pravatar.cc/100?img=13" alt="User avatar" />
          <AvatarFallback>MT</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xs text-gray-500">Mentee</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 mt-3">
        <ul className="space-y-1 px-3">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                    ? "bg-[#F9C5D5]/80 text-[#2C3E50] shadow-[0_0_10px_rgba(249,197,213,0.5)]"
                    : "text-[#333] hover:bg-[#F9C5D5]/30 hover:translate-x-1"
                  }`
                }
              >
                {tab.icon}
                <span>{tab.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-[#F3F3F3] px-6 py-3">
        <p className="text-xs text-center text-gray-400 mt-2">
          © 2025 Mentee App
        </p>
      </div>
    </aside>
  );
};
